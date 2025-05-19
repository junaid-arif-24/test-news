import React from 'react'
import { Link } from 'react-router-dom';

interface FooterCategoryProps {
    title : string;
    links : {name : string, path : string}[];
}

const FooterCategory: React.FC<FooterCategoryProps> = ({title, links}) => {
  return (
    <div>
        <h3 className='text-lg font-semibold mb-4'> {title}</h3>
        <ul className='text-gray-4000'>
        {links.map((link, index) => (
          <li key={index} className="mb-2">
            <Link to={link.path}>{link.name}</Link>
          </li>
        ))}
        </ul>
    </div>
  )
}

export default FooterCategory