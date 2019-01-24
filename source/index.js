import RSSParser from 'rss-parser';
import cheerio from 'cheerio';
import sourcesConfig from './sources.json';

const parser = new RSSParser();

export default function devComic({sources=[]}={}) {
    if (sources.length === 0) {
        sources = Object.keys(sourcesConfig);
    }

    const unknown = sources.filter(source => !(source in sourcesConfig));
    if (unknown.length > 0) {
        return Promise.reject(new Error(`Unknown sources: ${unknown.join(' ')}`));
    }

    return Promise.all(sources.map(async source => {
        const {url, key} = sourcesConfig[source];

        const response = await parser.parseURL(url);
        const $ = cheerio.load(response.items[0][key]);
        const image = $('img').attr('src');

        return {source, image};
    }));
}
