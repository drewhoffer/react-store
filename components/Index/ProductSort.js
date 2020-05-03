import { Dropdown, Menu } from 'semantic-ui-react';
import React from 'react';
import { useRouter, Router } from 'next/router';

function ProductSort({products}) {
  const router = useRouter();
  const [selected,setSelected] = React.useState("alpha");

  function isActive(route){
    return router.query.sort === route;
  }



  return (
    <Menu text stackable style={{margin: "0 0 2em 0"}}>
    <Menu.Item header>Sort By</Menu.Item>
    <Menu.Item
      active={isActive("alpha")}
      content="Alphabetical"
      onClick={() => router.push({
          pathname: "/",
          query: {
            sort: "alpha",
            page: 1
          }
        }
      )}
    />
    <Menu.Item
      content="Price: Lowest-Highest"
      active={isActive("low")}
      onClick={() => router.push({
          pathname: "/",
          query: {
            sort: "low",
            page: 1
        }
      }
      )}
    />
    <Menu.Item
      content="Price: Highest-Lowest"
      active={isActive("high")}
      onClick={() => router.push({
          pathname: "/",
          query: {
            sort: "high",
            page: 1
          }
        }
      )}
    />
  </Menu>
  );
}

export default ProductSort;