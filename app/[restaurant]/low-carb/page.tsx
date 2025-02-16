import { Metadata } from "next";
import prisma from "../../../lib/prisma";
import LowCarbClient from "./low-carb-client";

interface PageProps {
  params: { restaurant: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: params.restaurant },
  });

  if (!restaurant) {
    return {
      title: "Not Found",
      description: "The restaurant you're looking for doesn't exist",
    };
  }

  return {
    title: `Low-Carb Options at ${restaurant.name} - Complete 2025 Guide`,
    description: `Complete guide to eating low-carb at ${restaurant.name}. Find all menu items sorted by net carbs, calories, and more.`,
    openGraph: {
      title: `Low-Carb Options at ${restaurant.name} - Complete 2025 Guide`,
      description: `Complete guide to eating low-carb at ${restaurant.name}. Find all menu items sorted by net carbs, calories, and more.`,
    },
  };
}

export default async function LowCarbPage({ params }: PageProps) {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: params.restaurant,
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
    return null; // Or your 404 component
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

  return (
    <LowCarbClient
      restaurant={restaurant}
      restaurants={type?.restaurants || []}
      restaurantType={restaurantType}
    />
  );
} 