import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** Can be anything */
  Object: any;
};



export type Query = {
  __typename?: 'Query';
  getTableData: ServerGetTableDataReposesType;
};


export type QueryGetTableDataArgs = {
  input: TableDataFiltersInput;
};

export type ServerGetTableDataReposesType = {
  __typename?: 'ServerGetTableDataReposesType';
  payload?: Maybe<FilteredData>;
  errors?: Maybe<FieldError>;
};

export type FilteredData = {
  __typename?: 'FilteredData';
  totalResultCount?: Maybe<Scalars['Float']>;
  data?: Maybe<Array<TableDataResolverType>>;
};

export type TableDataResolverType = {
  __typename?: 'TableDataResolverType';
  author?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Float']>;
  description?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['DateTime']>;
  email?: Maybe<Scalars['String']>;
  system?: Maybe<Scalars['Int']>;
  children?: Maybe<Array<Scalars['Int']>>;
};


export type FieldError = {
  __typename?: 'FieldError';
  field?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};

export type TableDataFiltersInput = {
  pageNumber: Scalars['Int'];
  pageSize: Scalars['Int'];
  sortOrder: Scalars['String'];
  sortFieldName: Scalars['String'];
  idKey: Scalars['String'];
  dateKey: Scalars['String'];
  nextOrPreviousPage: Scalars['String'];
  sortValue?: Maybe<Scalars['Object']>;
  sortId?: Maybe<Scalars['Float']>;
  dateStartFilter?: Maybe<Scalars['String']>;
  dateEndFilter?: Maybe<Scalars['String']>;
  textFilter?: Maybe<Scalars['String']>;
  FilterInBySameSystemId?: Maybe<Scalars['Int']>;
};


export type GetTableDataQueryVariables = Exact<{
  input: TableDataFiltersInput;
}>;


export type GetTableDataQuery = (
  { __typename?: 'Query' }
  & { getTableData: (
    { __typename?: 'ServerGetTableDataReposesType' }
    & { errors?: Maybe<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>, payload?: Maybe<(
      { __typename?: 'FilteredData' }
      & Pick<FilteredData, 'totalResultCount'>
      & { data?: Maybe<Array<(
        { __typename?: 'TableDataResolverType' }
        & Pick<TableDataResolverType, 'author' | 'id' | 'date' | 'description' | 'email' | 'system' | 'children'>
      )>> }
    )> }
  ) }
);

export const GetTableDataDocument = gql`
    query GetTableData($input: TableDataFiltersInput!) {
  getTableData(input: $input) {
    errors {
      field
      message
    }
    payload {
      totalResultCount
      data {
        author
        id
        date
        description
        email
        system
        children
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetTableDataGQL extends Apollo.Query<GetTableDataQuery, GetTableDataQueryVariables> {
    document = GetTableDataDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
