import { Field, InputType, Query, Resolver, ObjectType, Arg, Int, Float, FieldResolver, Root } from "type-graphql";
import { TableData, SortDirection, NextOrPrevPage, ServerGetTableDataReposes } from '../../../shared/table-data.type';
import { getTableData } from "../services/elastic";
import { GraphQLScalarType } from 'graphql';

const GraphQLAny = new GraphQLScalarType({
  name: 'Object',
  description: 'Can be anything',
  parseValue(value) {
    return value
  },
  serialize(value) {
    return value
  },
  parseLiteral(ast) {
    return ast
  }
})

@ObjectType()
class FieldError {
    @Field(() => String, { nullable: true })
    field: string;

    @Field(() => String, { nullable: true })
    message: string;

}

@ObjectType()
class TableDataResolverType {
    @Field(() => String, { nullable: true })
    author: string

    @Field(() => Float, { nullable: true })
    id: number;

    @Field(() => String, { nullable: true })
    description: string;

    @Field(() => Date, { nullable: true })
    date: Date;

    @Field(() => String, { nullable: true })
    email: string;

    @Field(() => Int, { nullable: true })
    system: number;

    @Field(() => [Int], { nullable: true })
    children: number[];


}


@InputType()
class TableDataFiltersInput<T = TableData> {
    @Field(() => Int)
    pageNumber: number;

    @Field(() => Int)
    pageSize: number;

    @Field(() => String)
    sortOrder: SortDirection;

    @Field(() => String)
    sortFieldName: keyof TableData;

    @Field(() => String)
    idKey: keyof T;

    @Field(() => String)
    dateKey: keyof T;

    @Field(() => String)
    nextOrPreviousPage: NextOrPrevPage;

    @Field(() => GraphQLAny, { nullable: true })
    sortValue?: string | number | Date | null;

    @Field(() => Float, { nullable: true })
    sortId?: number | null;

    @Field(() => String, { nullable: true })
    dateStartFilter?: Date | number | string | null;

    @Field(() => String, { nullable: true })
    dateEndFilter?: Date | number | string | null;

    @Field(() => String, { nullable: true })
    textFilter?: string;

    
    @Field(() => Int, { nullable: true })
    FilterInBySameSystemId? : number

}
@ObjectType()
class FilteredData {
    @Field(() => Float, { nullable: true })
    totalResultCount?: number

    @Field(() => [TableDataResolverType], { nullable: true })
    data?: TableData[]
}

@ObjectType()
class ServerGetTableDataReposesType {

    @Field(() => FilteredData, { nullable: true })
    payload?: FilteredData

    @Field(() => FieldError, { nullable: true })
    errors?: FieldError
}


@Resolver(TableDataResolverType)
export class TableDataResolver {

    @FieldResolver(() => String)
    date(@Root() root: TableDataResolverType) {
        return new Date(root.date);
    }


    @Query(() => ServerGetTableDataReposesType)
    async getTableData(
        @Arg('input') input: TableDataFiltersInput
    ) {
        try {
            return await getTableData(input);
        } catch (message) {
            return {
                errors: {
                    field: 'elastic',
                    message: JSON.stringify(message)
                }
            }
        }

    }
}