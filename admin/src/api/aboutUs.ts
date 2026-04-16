import type { Static } from 'elysia';
import { client, handleError } from './base';
import type { AboutUsAdmin } from '@backend/src/controllers/admin/aboutUs/model';

// Regular ------------------------------------

async function getAll() {
  const { data, error } = await client.aboutUs.get();
  handleError(error);
  return data?.data;
}

async function getById(id: number) {
  const { data, error } = await client.aboutUs.id({ id }).get();
  handleError(error);
  return data?.data;
}

async function create(body: Static<typeof AboutUsAdmin.Model.postBody>) {
  const { data, error } = await client.aboutUs.post(body);
  handleError(error);
  return data?.id;
}

async function deleteById(id: number) {
  const { error } = await client.aboutUs.id({ id }).delete();
  handleError(error);
}

// Category -----------------------------------

async function getCategoryAll() {
  const { data, error } = await client.aboutUs.category.get();
  handleError(error);
  return data?.data;
}

async function getCategoryById(id: number) {
  const { data, error } = await client.aboutUs.category.id({ id }).get();
  handleError(error);
  return data?.data;
}

async function createCategory(body: Static<typeof AboutUsAdmin.Model.postCategoryBody>) {
  const { data, error } = await client.aboutUs.category.post(body);
  handleError(error);
  return data?.id;
}

async function deleteCategoryById(id: number) {
  const { error } = await client.aboutUs.category.id({ id }).delete();
  handleError(error);
}

// ==============================================

export const AboutUsAPI = {
  // Regular ------------------------------------
  getAll,
  getById,
  create,
  deleteById,

  // Category -----------------------------------
  getCategoryAll,
  getCategoryById,
  createCategory,
  deleteCategoryById,
};
