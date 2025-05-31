import { Suspense } from 'react';
import prisma from "../../lib/prisma";
 
import { cache } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import RestaurantClient from './restaurant-client';
import { notFound } from 'next/navigation';

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

export async function generateStaticParams() {
  const restaurants = await prisma.restaurant.findMany({
    select: { slug: true }
  });
  
  return restaurants.map((restaurant) => ({
    restaurant: restaurant.slug,
  }));
}

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
  const mealCount = restaurant.meals.length;
  const avgCalories = Math.round(
    restaurant.meals.reduce((sum, meal) => sum + (meal.calories || 0), 0) / mealCount
  );

  return {
    title: `${restaurant.name} Nutrition Facts & Calories - ${mealCount} Menu Items | HealthyFastFood`,
    description: `Complete nutrition guide for ${restaurant.name} with ${mealCount} menu items. Average ${avgCalories} calories per item. Find low-calorie, keto, and allergen-free options. Updated ${new Date().getFullYear()}.`,
    keywords: [
      `${restaurant.name} nutrition`,
      `${restaurant.name} calories`,
      `${restaurant.name} menu nutrition facts`,
      `${restaurant.name} healthy options`,
      `${restaurant.name} keto menu`,
      `${restaurant.name} low calorie meals`
    ].join(', '),
    alternates: {
      canonical: `https://healthyfastfood.org/${restaurant.slug}`,
      languages: {
        'en-US': `https://healthyfastfood.org/${restaurant.slug}`,
      }
    },
    openGraph: {
      title: `${restaurant.name} Nutrition Facts & Calorie Counter`,
      description: `Browse ${mealCount} ${restaurant.name} menu items with complete nutrition data. Filter by calories, allergens, and dietary preferences.`,
      url: `https://healthyfastfood.org/${restaurant.slug}`,
      siteName: 'HealthyFastFood.org',
      type: 'website',
      locale: 'en_US',
      images: [{
        url: `https://healthyfastfood.org/images/restaurant_logos/${restaurant.slug}.webp`,
        width: 1200,
        height: 630,
        alt: `${restaurant.name} Nutrition Facts`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@healthyfastfood',
      title: `${restaurant.name} Nutrition Facts & Calories`,
      description: `Find healthy options at ${restaurant.name}. Browse ${mealCount} menu items with complete nutrition data.`,
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  }
}

// Add JSON-LD structured data
function generateStructuredData(restaurant: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurant.name,
    url: `https://healthyfastfood.org/${restaurant.slug}`,
    servesCuisine: restaurant.restaurantTypes[0]?.name || 'Fast Food',
    priceRange: '$$',
    image: `https://healthyfastfood.org/images/restaurant_logos/${restaurant.slug}.webp`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: restaurant.meals.length
    },
    menu: {
      '@type': 'Menu',
      hasMenuSection: restaurant.meals.reduce((sections: any[], meal: any) => {
        const category = meal.category.name;
        if (!sections.find(s => s.name === category)) {
          sections.push({
            '@type': 'MenuSection',
            name: category,
            hasMenuItem: []
          });
        }
        return sections;
      }, [])
    }
  };
}

export default async function RestaurantPage({ 
  params 
}: { 
  params: { restaurant: string } 
}) {
  const data = await getRestaurantData(params.restaurant);
  
  if (!data) {
    notFound(); // Better than returning null
  }

  const structuredData = generateStructuredData(data.restaurant);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <RestaurantClient
        restaurant={data.restaurant}
        restaurants={data.restaurants}
        restaurantType={data.restaurantType}
      />
    </>
  );
}