import type { Static } from 'elysia';
import { client, handleError } from './base';
import type { NewsAdminModel } from '@backend/src/controllers/admin/news/model';

// Eden, what a crappy framework, type-safe?? yeah type-safe but so stupid it doesnt allows you to get the api response type directly,
// had to write a dedicated file to export my api model just so the frontend knows the type for my api requests/responses.
// using elysia as many people said it was so simple and can make your dx better, but apparently its not, doesnt quite meet my expectation.
// this is what does to a person when they're too obsessed with blue archive, spatting random weeb things while forgoting to make a well-designed framework
// spent most of my time troubleshooting shits which are supposed to be a simple thing that should work out-of-the-box

async function getAll(title: string) {
  const { data, error } = await client.news.get({ query: { title } });
  handleError(error);
  return data?.data;
}

async function getById(id: number) {
  const { data, error } = await client.news.id({ id }).get();
  handleError(error);
  return data?.data;
}

async function create(news: Static<typeof NewsAdminModel.Model.postBody>) {
  const { data, error } = await client.news.post(news);
  handleError(error);
  return data?.id;
}

async function deleteById(id: number) {
  const { error } = await client.news.id({ id }).delete();
  handleError(error);
}

export const NewsAPI = { getAll, getById, create, deleteById };
