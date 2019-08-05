# ORM - TypeORM

## DB Migrations

* [TypeOrm Migration Guide (this is the top resource for us to use)](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md)
* [Safe Operations for High Volume Postgresql (Good guide with workarounds for risky changes)](https://www.braintreepayments.com/blog/safe-operations-for-high-volume-postgresql/)

Our migrations can be found in [src/db](src/db)

We should strive to use the queryRunner API provided by TypeORM to make these migrations relatively db agnostic. However, you are able to run raw SQL commands as shown, e.g. `await queryRunner.query(ALTER TABLE "import_file" ADD COLUMN IF NOT EXISTS extension varchar);`

## Design Decision: Data Mapper Pattern

* Definition: Simply said, the __data mapper pattern__ is an approach to access your database within repositories instead of models. You can read more about data mapper on Wikipedia.
* Using the Data Mapper approach, you define all your query methods in separate classes called "repositories", and you save, remove, and load objects using repositories. In data mapper your entities are very dumb - they just define their properties and may have some "dummy" methods.
  _src: [What is the Data Mapper pattern?](http://typeorm.io/#/active-record-data-mapper/what-is-the-data-mapper-pattern)_
* [Wikipedia article on Data mapper pattern](https://en.wikipedia.org/wiki/Data_mapper_pattern)

## __WIP__ Example of how to build an Entity _(aka Model)_

* See available [Column.type definitions available for Postgres](http://typeorm.io/#/entities/column-types-for-postgres)
* NOTE: Classes are bad, so we use `Interface`s as a primary way of communicating contracts between methods. We *do not* `export` a class or `import` a class from the Entity itself.
