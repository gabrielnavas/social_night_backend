exports.up = knex =>
  knex.schema.createTable('friend', table => {
    table.integer('user_id_one')
      .references('user.id')
      .notNullable()
      .onDelete('CASCADE')
    
    table.integer('user_id_two')
      .references('user.id')
      .notNullable()
      .onDelete('CASCADE')
      
    table.timestamp('sended_at').defaultTo(knex.fn.now())
    table.timestamp('accepted_at').nullable().defaultTo(null)
    })

exports.down = knex => knex.schema.dropTable('friend')
