import {
  SiFacebook,
  SiInstagram,
  SiX
} from "@icons-pack/react-simple-icons"
import {
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  ShoppingBasketIcon
} from "lucide-react"
import Link from "next/link"

function Footer() {
  return (
    <footer className="bg-app-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="">
            <Link href='/' className="flex items-center gap-2 mb-4">
              <ShoppingBasketIcon className="size-6 text-white" />
              <span className="text-xl font-semibold">
                Thinkit
              </span>
            </Link>
            <p className="text-sm text-white/70 mb-4">
              Bringing fresh, organic groceries straight from local farms to your doorstep. Nourish your home with Earth&apos;s finest.
            </p>
            <div className="flex gap-3">
              {
                [
                  {
                    icon: SiFacebook,
                    name: "Facebook",
                    link: "#"
                  },
                  {
                    icon: SiX,
                    name: "X (Formerly Twitter)",
                    link: "#"
                  },
                  {
                    icon: SiInstagram,
                    name: "Instagram",
                    link: "#"
                  },
                ].map((social, i) => (
                  <a
                    aria-label={social.name}
                    title={social.name}
                    className="size-9 rounded-lg bg-white/10 flex-center hover:bg-white/2"
                    href={social.link} key={i}
                  >
                    <social.icon className="size-4" />
                  </a>
                ))
              }
            </div>
          </div>
          {/* Dynamic Sections */}
          {
            [
              {
                title: "Quick Links",
                links: [
                  {
                    label: "All Products",
                    to: "/products"
                  },
                  {
                    label: "Flash Deals",
                    to: "/deals"
                  },
                  {
                      label: "Track Order",
                      to: "/orders"
                  },
                  {
                      label: "Delivery Partner",
                      to: "/delivery"
                  },
                ],
              },
              {
                title: "Customer Service",
                links: [
                  {
                    label: "My Account",
                    to: "#"
                  },
                  {
                    label: "Order History",
                    to: "#"
                  },
                  {
                    label: "Addresses",
                    to: "#"
                  },
                  {
                    label: "Help Center",
                    href: "#"
                  },
                ],
              },
            ].map((section, i) => (
              <div className="" key={i}>
                <h3 className="text-sm font-semibold uppercase mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      {link.to ? (
                        <Link href={link.to} className="text-sm text-white/70 hover:text-white">
                          {link.label}
                        </Link>
                      ) : (
                          <a href={link.href} className="text-sm text-white/70 hover:text-white">
                            {link.label}
                          </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          }
          {/* Contact */}
          <div className="">
            <h3 className="text-sm font-semibold uppercase mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              {
                [
                  {
                    icon: MapPinIcon,
                    text: "123 Green Valley Rd, Portland"
                  },
                  {
                    icon: PhoneIcon,
                    text: "+1 (111) 123-4567"
                  },
                  {
                    icon: MailIcon,
                    text: "hello@example.com"
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li key={i} className="flex gap-3 text-sm text-white/70">
                      <Icon className="size-4 text-white" /> {item.text}
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </div>
        {/* Bottom */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/50">
            © 2026 DarkKnight. All rights reserved.
          </p>
          <div className="flex gap-4">
            {
              [
                {
                  label: "Privacy Policy",
                  href: "#"
                },
                {
                  label: "Terms of Service",
                  href: "#"
                },
              ].map((link, i) => (
                <a
                  href={link.href}
                  key={i}
                  className="text-xs text-white/50 hover:text-white/70"
                >
                  {link.label}
                </a>
              ))
            }
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
