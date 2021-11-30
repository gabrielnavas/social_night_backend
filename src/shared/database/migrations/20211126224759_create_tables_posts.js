exports.up = knex =>
  knex.schema.createTable('post', table => {
    table.increments('id')
    table.text('comment').notNullable()
    table.text('image').nullable()

    table.integer('user_id')
      .references('user.id')
      .notNullable()
      .onDelete('CASCADE')

    table.timestamps(true, true)
  })

exports.down = knex => knex.schema.dropTable('post')
