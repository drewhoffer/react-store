import { Container , Pagination } from 'semantic-ui-react';
import { useRouter, Router } from 'next/router';

function ProductPagination({totalPages, sort, page}) {
  const router = useRouter();

  
  return (
    <Container textAlign="center" style={{ margin: '2em'}}>
      <Pagination
        activePage={page}
        totalPages={totalPages}
        onPageChange={(event, data) => {
          data.activePage === 1
          ? router.push(
            {
              pathname: "/",
              query: 
                {
                  sort: sort,
                  page: data.activePage
                }
            })
          : router.push(
            {
              pathname: "/",
              query: 
                {
                  sort: sort,
                  page: data.activePage
                }
            })
        }}/>
    </Container>
  );
}

export default ProductPagination;
