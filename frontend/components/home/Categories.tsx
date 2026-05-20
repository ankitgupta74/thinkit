"use client";

import Image from "next/image"
import Link from "next/link"

function Categories() {
  return (
    <section className='py-16'>
      <div className="max-w-7xl mx-auto">
        <div className="">
          <h2 className='text-2xl font-semibold'>
            Browse Categories
          </h2>
          <p className='text-sm text-app-text-light mt-1'>
            Find exactly what you need using
          </p>
        </div>
        <div className="flex items-center mt-8 overflow-x-scroll no-scrollbar">
          {
            [
              {
                slug: "fruits-vegetables",
                name: "Fruits & Vegetables",
                image: '/assets/fruits_vegetables.png'
              },
              {
                slug: "personal-care",
                name: "Personal Care",
                image: '/assets/personal_care.png'
              },
              {
                slug: "pantry-staples",
                name: "Pantry Staples",
                image: '/assets/pantry_staples.png'
              },
              {
                slug: "bakery",
                name: "Bakery",
                image: '/assets/bakery.png'
              },
              {
                slug: "beverages",
                name: "Beverages",
                image: '/assets/drinks.png'
              },
              {
                slug: "meat-seafood",
                name: "Meat & Seafood",
                image: '/assets/meat_seafood.png'
              },
              {
                slug: "snacks",
                name: "Snacks",
                image: '/assets/snacks.png'
              },
              {
                slug: "frozen-foods",
                name: "Frozen Foods",
                image: '/assets/frozen_foods.png'
              },
              {
                slug: "baby-care",
                name: "Baby Care",
                image: '/assets/baby_care.png'
              },
              {
                slug: "dairy-eggs",
                name: "Dairy & Eggs",
                image: '/assets/dairy_eggs.png'
              }
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                onClick={() => window.scrollTo(0, 0)}
                className='group flex flex-col items-center gap-3 p-4'
              >
                <div className="size-18 sm:size-26 p-2 rounded-2xl overflow-hidden bg-orange-100 transition-all group-hover:ring-2 group-hover:ring-orange-300/75">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={120}
                    height={120}
                    className="w-full h-full object-contain transition-all"
                  />
                </div>
                <span className="text-xs font-medium to-zinc-600 text-center leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))
          }
        </div>
      </div>
    </section>
  )
}

export default Categories
