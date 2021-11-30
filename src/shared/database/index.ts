import pgp from 'pg-promise'

/*
  postgres://username:password@host:port/database?ssl=false&application_name=name
  &fallback_application_name=name&client_encoding=encoding
*/


function camelizeColumns(data: any) {
  const tmp = data[0];
  for (const prop in tmp) {
      const camel = pgp.utils.camelize(prop);
      if (!(camel in tmp)) {
          for (let i = 0; i < data.length; i++) {
              const d = data[i];
              d[camel] = d[prop];
              delete d[prop];
          }
      }
  }
}


const initOptions = {
  // pg-promise initialization options...
  receive(data: any, result: any, e: any) {
      camelizeColumns(data);
  }    
}  


function getConnectionStr(): string {
  const NODE_ENV = process.env.NODE_ENV as string
  if (NODE_ENV === 'test') {
    return 'postgres://postgres:postgres@localhost:5432/database'
  }
  else if (NODE_ENV === 'dev') {
    return 'postgres://postgres:postgres@localhost:5432/database'
  }
  else if (NODE_ENV === 'production') {
    return process.env.DATABASE as string
  }
  else {
    throw new Error('NODE_ENV on .env should to be test, dev or production')
  }
}


let connectionStr: string = getConnectionStr()

const pg = pgp(initOptions)
// pgp.pg.types.setTypeParser(20, BigInt); // Type Id 20 = BIGINT | BIGSERIAL
pg.pg.types.setTypeParser(20, BigInt)  // Type Id 20 = BIGINT | BIGSERIAL
const db = pg(connectionStr)

export {db, pg}



