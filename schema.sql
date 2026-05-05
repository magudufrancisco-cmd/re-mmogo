-- ============================================================
-- Re-Mmogo Motshelo Management System
-- SQL Server Database Schema
-- ============================================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ReMmogoDB')
BEGIN
    CREATE DATABASE ReMmogoDB;
END
GO

USE ReMmogoDB;
GO

-- 1. GROUPS
CREATE TABLE Groups (
    group_id             INT IDENTITY(1,1) PRIMARY KEY,
    name                 NVARCHAR(100)  NOT NULL,
    description          NVARCHAR(255),
    location             NVARCHAR(100),
    start_date           DATE           NOT NULL,
    monthly_contribution DECIMAL(10,2)  NOT NULL DEFAULT 1000.00,
    interest_rate        DECIMAL(5,2)   NOT NULL DEFAULT 20.00,
    interest_target      DECIMAL(10,2)  NOT NULL DEFAULT 5000.00,
    password_hash        NVARCHAR(255)  NOT NULL,
    created_at           DATETIME       DEFAULT GETDATE()
);
GO

-- 2. MEMBERS
CREATE TABLE Members (
    member_id  INT IDENTITY(1,1) PRIMARY KEY,
    group_id   INT            NOT NULL,
    name       NVARCHAR(100)  NOT NULL,
    email      NVARCHAR(150)  NOT NULL UNIQUE,
    phone      NVARCHAR(20),
    role       NVARCHAR(20)   NOT NULL DEFAULT 'member',
    status     NVARCHAR(20)   NOT NULL DEFAULT 'active',
    join_date  DATE           NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    created_at DATETIME       DEFAULT GETDATE(),
    CONSTRAINT FK_Members_Group  FOREIGN KEY (group_id) REFERENCES Groups(group_id),
    CONSTRAINT CHK_Member_Role   CHECK (role   IN ('member', 'signatory')),
    CONSTRAINT CHK_Member_Status CHECK (status IN ('active', 'inactive'))
);
GO

-- 3. CONTRIBUTIONS
CREATE TABLE Contributions (
    contribution_id INT IDENTITY(1,1) PRIMARY KEY,
    group_id        INT            NOT NULL,
    member_id       INT            NOT NULL,
    month           NVARCHAR(7)    NOT NULL,
    amount          DECIMAL(10,2)  NOT NULL DEFAULT 1000.00,
    proof           NVARCHAR(255),
    status          NVARCHAR(20)   NOT NULL DEFAULT 'pending',
    submitted_date  DATE           NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    created_at      DATETIME       DEFAULT GETDATE(),
    CONSTRAINT FK_Contributions_Group  FOREIGN KEY (group_id)  REFERENCES Groups(group_id),
    CONSTRAINT FK_Contributions_Member FOREIGN KEY (member_id) REFERENCES Members(member_id),
    CONSTRAINT CHK_Contribution_Status CHECK (status IN ('pending', 'approved', 'rejected')),
    CONSTRAINT UQ_Contribution_Member_Month UNIQUE (member_id, month)
);
GO

-- 4. LOANS
CREATE TABLE Loans (
    loan_id      INT IDENTITY(1,1) PRIMARY KEY,
    group_id     INT            NOT NULL,
    member_id    INT            NOT NULL,
    principal    DECIMAL(10,2)  NOT NULL,
    balance      DECIMAL(10,2)  NOT NULL,
    interest_due DECIMAL(10,2)  NOT NULL,
    reason       NVARCHAR(255),
    date_taken   DATE           NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    status       NVARCHAR(20)   NOT NULL DEFAULT 'pending',
    created_at   DATETIME       DEFAULT GETDATE(),
    CONSTRAINT FK_Loans_Group  FOREIGN KEY (group_id)  REFERENCES Groups(group_id),
    CONSTRAINT FK_Loans_Member FOREIGN KEY (member_id) REFERENCES Members(member_id),
    CONSTRAINT CHK_Loan_Status CHECK (status IN ('pending', 'approved', 'rejected', 'fully_paid'))
);
GO

-- 5. LOAN PAYMENTS
CREATE TABLE LoanPayments (
    payment_id   INT IDENTITY(1,1) PRIMARY KEY,
    loan_id      INT            NOT NULL,
    member_id    INT            NOT NULL,
    amount       DECIMAL(10,2)  NOT NULL,
    proof        NVARCHAR(255),
    status       NVARCHAR(20)   NOT NULL DEFAULT 'pending',
    payment_date DATE           NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    created_at   DATETIME       DEFAULT GETDATE(),
    CONSTRAINT FK_LoanPayments_Loan   FOREIGN KEY (loan_id)   REFERENCES Loans(loan_id),
    CONSTRAINT FK_LoanPayments_Member FOREIGN KEY (member_id) REFERENCES Members(member_id),
    CONSTRAINT CHK_LoanPayment_Status CHECK (status IN ('pending', 'approved', 'rejected'))
);
GO

-- 6. APPROVALS
CREATE TABLE Approvals (
    approval_id  INT IDENTITY(1,1) PRIMARY KEY,
    group_id     INT          NOT NULL,
    signatory_id INT          NOT NULL,
    ref_type     NVARCHAR(30) NOT NULL,
    ref_id       INT          NOT NULL,
    action       NVARCHAR(20) NOT NULL,
    action_date  DATE         NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    created_at   DATETIME     DEFAULT GETDATE(),
    CONSTRAINT FK_Approvals_Group     FOREIGN KEY (group_id)     REFERENCES Groups(group_id),
    CONSTRAINT FK_Approvals_Signatory FOREIGN KEY (signatory_id) REFERENCES Members(member_id),
    CONSTRAINT CHK_Approval_Action    CHECK (action   IN ('approved', 'rejected')),
    CONSTRAINT CHK_Approval_RefType   CHECK (ref_type IN ('loan', 'loan_payment', 'contribution')),
    CONSTRAINT UQ_Approval_Signatory_Ref UNIQUE (signatory_id, ref_type, ref_id)
);
GO

-- SEED DATA
INSERT INTO Groups (name, description, location, start_date, monthly_contribution, interest_rate, interest_target, password_hash)
VALUES (
    'Re-Mmogo Savings Group',
    'A community savings group based in Gaborone.',
    'Gaborone, Botswana',
    '2025-01-01',
    1000.00, 20.00, 5000.00,
    '$2a$10$placeholder_hash_replace_with_bcrypt'
);
GO

INSERT INTO Members (group_id, name, email, phone, role, status, join_date)
VALUES
(1, 'Thabo Mokoena',   'thabo@email.com',   '71234567', 'member',    'active',   '2025-01-01'),
(1, 'Kefilwe Sithole', 'kefilwe@email.com', '72345678', 'signatory', 'active',   '2025-01-01'),
(1, 'Mpho Dlamini',    'mpho@email.com',    '73456789', 'member',    'active',   '2025-01-01'),
(1, 'Boitumelo Nkosi', 'boitu@email.com',   '74567890', 'signatory', 'active',   '2025-01-01'),
(1, 'Lesego Motsepe',  'lesego@email.com',  '75678901', 'member',    'active',   '2025-02-01'),
(1, 'Dineo Khumalo',   'dineo@email.com',   '76789012', 'member',    'inactive', '2025-02-01');
GO