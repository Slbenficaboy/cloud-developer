// export const config = {
//   "dev": {
//     "username": "postgres",
//     "password": "ud4citypostgres",
//     "database": "udacitycourse2sqldb",
//     "host": "udacitycourse2sqldb.cof4okxqg3z7.us-east-1.rds.amazonaws.com",
//     "dialect": "postgres",
//     "aws_region": "us-east-1",
//     "aws_profile": "default",
//     "aws_media_bucket": "my-626970730723-udacity-course2-lesson-bucket-dev"
//   },
//   "prod": {
//     "username": "",
//     "password": "",
//     "database": "udagram_prod",
//     "host": "",
//     "dialect": "postgres"
//   }
// }

export const config = {
  "username": process.env.POSTGRES_USERNAME,
  "password": process.env.POSTGRES_PASSWORD,
  "database": process.env.POSTGRES_DATABSE,
  "host": process.env.POSTGRES_HOST,
  "dialect": "postgres",
  "aws_region": process.env.AWS_REGION,
  "aws_profile": process.env.AWS_PROFILE,
  "aws_media_bucket": process.env.AWS_MEDIA_BUCKET,
  "jwt_secret": process.env.JWT_SECRET
}
