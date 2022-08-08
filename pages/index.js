import path from 'path';

export function getStaticProps() {
    path.resolve(process.cwd(), 'fonts');
    path.resolve(process.cwd(), 'images', 'battle');
    return {
        props: {
            a: 0
        }
    }
}

export default function Home() {
    return (
        <h1>hewwo</h1>
    )
}