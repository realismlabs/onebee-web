// (2023-05-26) Ignore -- this is a test bed, will wait for API to be finalized.

// Core fields that exist in every connection type.
export interface CoreConnectionCreationProps {
  createdAt: Date;
  name: string;
  workspaceId: number;
  connectionType: "snowflake" | "postgres" | "bigquery";
}

// Fields that exist in a Snowflake connection.
export interface SnowflakeSpecificProps {
  accountIdentifier: string | null;
  useCustomHost: boolean;
  customHost: string | null;
  customHostAccountIdentifier: string | null;
  snowflakeAuthMethod: string;
  warehouse: string;
  basicAuthUsername: string | null;
  basicAuthPassword: string | null;
  keyPairAuthUsername: string | null;
  keyPairAuthPrivateKey: string | null;
  keyPairAuthPrivateKeyPassphrase: string | null;
  role: string | null;
}

// Fields that exist in a Postgres connection.
export interface PostgresSpecificProps {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

// Fields that exist in a BigQuery connection.
export interface BigQuerySpecificProps {
  projectId: string;
  dataset: string;
  serviceAccountKey: string;
}

// Merge the core props with the specific props for each connection type.
export type SnowflakeConnectionCreationProps = CoreConnectionCreationProps &
  SnowflakeSpecificProps;
export type PostgresConnectionCreationProps = CoreConnectionCreationProps &
  PostgresSpecificProps;
export type BigQueryConnectionCreationProps = CoreConnectionCreationProps &
  BigQuerySpecificProps;

// Now, create a type that has all possible fields.
export type AllConnectionProps = CoreConnectionCreationProps &
  SnowflakeSpecificProps &
  PostgresSpecificProps &
  BigQuerySpecificProps;

// Connection types with an ID, for use after creation.
export type SnowflakeConnection = SnowflakeConnectionCreationProps & {
  id: number;
};
export type PostgresConnection = PostgresConnectionCreationProps & {
  id: number;
};
export type BigQueryConnection = BigQueryConnectionCreationProps & {
  id: number;
};

// This would be the type of a row in your Postgres database.
export type ConnectionDatabaseRow = AllConnectionProps & { id: number };
