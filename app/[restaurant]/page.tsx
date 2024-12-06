import { Suspense } from 'react';
import prisma from "../../lib/prisma";
import RestaurantClient from './restaurant-client';

 
// This replaces getStaticProps
async function getRestaurantData(slug: string) {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: String(slug),
    },
    include: {
      meals: {
        include: {
          category: {
            include: {
              parentCategory: true,
            },
          },
          variants: {
            include: {
              subvariants: true,
            },
          },
        },
      },
      restaurantTypes: true,
    },
  });

  if (!restaurant) {
    return null;
  }

  const restaurantType = restaurant.restaurantTypes[0].slug;

  const type = await prisma.restaurantType.findUnique({
    where: {
      slug: restaurantType,
    },
    include: {
      restaurants: true,
    },
  });

  return {
    restaurant,
    restaurants: type.restaurants,
    restaurantType,
  };
}

export default async function RestaurantPage({ 
  params 
}: { 
  params: { restaurant: string } 
}) {
  const data = await getRestaurantData(params.restaurant);
  
  if (!data) {
    return null; // or your 404 component
  }

  return (
       <RestaurantClient 
        restaurant={data.restaurant}
        restaurants={data.restaurants}
        restaurantType={data.restaurantType}
      />
   );
}