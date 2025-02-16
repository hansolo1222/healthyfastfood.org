import { Suspense } from 'react';
import prisma from "../../lib/prisma";
 
import { cache } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import RestaurantClient from './restaurant-client';
const getRestaurantData = cache(async (slug: string) => {
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
});

export async function generateMetadata(
  { params }: { params: { restaurant: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const data = await getRestaurantData(params.restaurant);

  if (!data) {
    return {
      title: 'Restaurant Not Found',
      description: 'The requested restaurant could not be found.',
    }
  }

  const { restaurant } = data;

  return {
    title: `${restaurant.name} Nutrition Facts and Calorie Info [Updated ${new Date().getFullYear()}] | HealthyFastFood`,
    description: `Detailed nutrition facts for every menu item at ${restaurant.name}. Also see keto, vegetarian, vegan and allergen menus.`,
    keywords: `${restaurant.slug},nutrition,facts`,
    alternates: {
      canonical: `https://healthyfastfood.org/${restaurant.slug}`,
    },
    openGraph: {
      title: `${restaurant.name} Menu Nutrition Facts and Calories [Updated ${new Date().getFullYear()}] | Healthy Fast Food`,
      description: `Detailed nutrition facts for every menu item at ${restaurant.name}. Also see keto, vegetarian and allergen menus.`,
      url: `https://healthyfastfood.org/${restaurant.slug}`,
      siteName: 'HealthyFastFood',
      type: 'website',
      images: [{
        url: `/images/restaurant_logos/${restaurant.slug}.webp`,
        width: 400,
        height: 400,
        alt: `${restaurant.name} Logo`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@healthyfastfood',
    },
  }
}

export default async function RestaurantPage({ 
  params 
}: { 
  params: { restaurant: string } 
}) {
  const data = await getRestaurantData(params.restaurant);
  
  if (!data) {
    return null;  
  }

  return (
       <RestaurantClient
        restaurant={data.restaurant}
        restaurants={data.restaurants}
        restaurantType={data.restaurantType}
      />
   );
}