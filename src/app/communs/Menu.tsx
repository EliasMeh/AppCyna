'use client'
import React from 'react'
import {useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Menu = () => {

    const [open, setOpen] = useState(false);
  return (
    <div>
        <Image
            src="/assets/burger-menu.png"
            alt="menu"
            width={28}
            height={28}
            className="cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
        />{open && (
            <div>
                <Link href="/">Se connecter</Link>
                <Link href="/">S'inscrire</Link>
                <Link href="/">CGU</Link>
                <Link href="/">Mention légales</Link>
                <Link href="/">Contact</Link>
                <Link href="/">À propos de Cyna</Link>
$            </div>)
        }
    </div>
  )
}

export default Menu