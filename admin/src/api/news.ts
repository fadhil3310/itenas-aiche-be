import { client } from './base'
import type { NewsModelType } from '@backend/src/controllers/admin/news/model';

// News (what a crappy framework, type-safe?? yeah type-safe but so stupid it doesnt allows you to get the api request/response type directly)
// using elysia as many people said it was so simple and can make your dx better, but apparently its not??
// this is what does to a person when they're too obsessed with blue archive, spatting random weeb things while forgoting to make a well-designed framework
// spent most of my time troubleshooting shits which are supposed to be a simple thing that should work out-of-the-box

async function getAllNews(title: string) {
  const { data, error } = await client.news.get({ query: { title } });
  return data?.news;
}

async function getNewsById(id: number) {
  const { data, error } = await client.news.id({ id }).get();
  return data?.news;
}

async function createNews(news: NewsModelType['createBody']) {
  const { data } = await client.news.post(news);
  return data?.id;
}

async function deleteNewsById(id: number) {
  await client.news.id({ id }).delete();
}


export const NewsAPI = { getAllNews, getNewsById, createNews, deleteNewsById };