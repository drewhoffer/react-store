import React from 'react';
import axios from 'axios';
import ProductList from '../components/Index/ProductList';
import ProductPagination from '../components/Index/ProductPagination';
import baseUrl from '../utils/baseUrl';
import ProductSort from '../components/Index/ProductSort';

function Home({ products, totalPages, sort, page }) {
  return (
    <>
      <ProductSort products = {products} />
      <ProductList products = {products}/>
      <ProductPagination totalPages = {totalPages} sort = {sort} page= {page}/>
    </>
  );
}


Home.getInitialProps = async (ctx) => {
  const page = ctx.query.page ? ctx.query.page : "1";
  const sort = ctx.query.sort ? ctx.query.sort : "alpha"
  const size = 9;
  let url = `${baseUrl}/api/products`;
  console.log(url)
  const payload = { params: { page, size, sort } };
  const response = await axios.get(url, payload);
  return response.data;
}

export default Home;
