import strapi from '@strapi/strapi';

strapi().start().catch(err => {
  console.error(err);
  process.exit(1);
});
