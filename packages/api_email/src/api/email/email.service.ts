import { User } from "core_api/types";
import Configuration from "./configuration";
import { NotFoundError } from "core_api/errors";

function findConfiguration(auth: User) {
  return Configuration.query()
    .where("idAuth", auth.id)
    .first()
    .execute();
}

async function configure(body: any, auth: User) {
  const data = {
    ...body,
    idAuth: auth.id,
  };

  let item = await findConfiguration(auth);

  if (item) {
    item = await item.$query().updateAndFetchById(item.id as number, data);
  } else {
    item = await Configuration.query().insertAndFetch(data);
  }
  return item;
}

async function send(body: any, auth: User) {
  /* const config = await findConfiguration(auth);
  if (!config) throw new NotFoundError("configuration not found");
  return; */

  const mailjet = require('node-mailjet').connect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE
  )
  try {
    const result = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'etienne.robert1698@gmail.com',
            Name: 'Me',
          },
          To: [
            {
              Email: 'etienne.robert1698@gmail.com',
              Name: 'You',
            },
          ],
          Subject: 'My first Mailjet Email!',
          TextPart: 'Greetings from Mailjet!',
          HTMLPart:
            '<h3>Dear passenger 1, welcome to <a href="https://www.mailjet.com/">Mailjet</a>!</h3><br />May the delivery force be with you!',
        },
      ],
    });
    console.log(result.body);
  } catch (err) {

  }

  // TEST
  
}

export default {
  configure,
  send,
  findConfiguration,
};
