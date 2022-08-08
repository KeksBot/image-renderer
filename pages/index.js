import path from 'path';

export function getStaticProps() {
    path.resolve(process.cwd(), 'fonts');
    path.resolve(process.cwd(), 'images', 'battle');
}

export default function() {
    return (
        <h1>hewwo</h1>
    )
}