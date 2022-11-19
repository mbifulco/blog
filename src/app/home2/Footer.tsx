import Link from 'next/link';

const Footer = () => {
  return (
    <footer>
      <div>© 2019-{new Date().getFullYear()} Mike Bifulco</div>
      <div>
        🎟️ Interested in sponsoring Tiny Improvements? &rarr;{' '}
        <Link href="/sponsor">Get in touch</Link>
      </div>
    </footer>
  );
};

export default Footer;
