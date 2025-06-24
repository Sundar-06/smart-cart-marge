BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[session] (
    [id] NVARCHAR(1000) NOT NULL,
    [shop] NVARCHAR(1000) NOT NULL,
    [state] NVARCHAR(1000) NOT NULL,
    [isOnline] BIT NOT NULL CONSTRAINT [session_isOnline_df] DEFAULT 0,
    [scope] NVARCHAR(1000),
    [expires] DATETIME2,
    [accessToken] NVARCHAR(1000) NOT NULL,
    [userId] BIGINT,
    [firstName] NVARCHAR(1000),
    [lastName] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [accountOwner] BIT NOT NULL CONSTRAINT [session_accountOwner_df] DEFAULT 0,
    [locale] NVARCHAR(1000),
    [collaborator] BIT CONSTRAINT [session_collaborator_df] DEFAULT 0,
    [emailVerified] BIT CONSTRAINT [session_emailVerified_df] DEFAULT 0,
    CONSTRAINT [session_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
