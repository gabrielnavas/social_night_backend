exports.up = knex =>
  knex.schema.createTable('comment', table => {
    table.increments('id')
    table.text('content').notNullable()
    table.binary('image').nullable()

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    table.integer('post_id')
      .references('post.id')
      .notNullable()
      .onDelete('CASCADE')

    table.integer('user_id')
      .references('user.id')
      .notNullable()
      .onDelete('CASCADE')
  })

exports.down = knex => knex.schema.dropTable('comment')
