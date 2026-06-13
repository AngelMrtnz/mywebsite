const fs = require('fs');
const https = require('https');

const url = 'https://arxiv.org/a/martinezmunoz_a_1.atom';
const file = 'public/papers.xml';

https.get(url, (res) => {
    let arxivData = '';
    res.on('data', chunk => arxivData += chunk);
    res.on('end', () => {
        let localData = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
        
        const extractId = (entryText) => {
            const match = entryText.match(/<id>(.*?)<\/id>/);
            return match ? match[1] : null;
        };

        const entries = localData.match(/<entry>[\s\S]*?<\/entry>/g) || [];
        const localMeta = {};
        
        for (const entry of entries) {
            const id = extractId(entry);
            if (id) {
                const doiMatch = entry.match(/<arxiv:doi[^>]*>.*?<\/arxiv:doi>/);
                const journalMatch = entry.match(/<arxiv:journal_ref[^>]*>.*?<\/arxiv:journal_ref>/);
                localMeta[id] = {
                    doi: doiMatch ? doiMatch[0] : null,
                    journal: journalMatch ? journalMatch[0] : null
                };
            }
        }
        
        let mergedData = arxivData.replace(/<entry>[\s\S]*?<\/entry>/g, (arxivEntry) => {
            const id = extractId(arxivEntry);
            if (id && localMeta[id]) {
                let modifiedEntry = arxivEntry;
                if (localMeta[id].journal && !modifiedEntry.includes('arxiv:journal_ref')) {
                    modifiedEntry = modifiedEntry.replace('</entry>', `  ${localMeta[id].journal}\n  </entry>`);
                }
                if (localMeta[id].doi && !modifiedEntry.includes('arxiv:doi')) {
                    modifiedEntry = modifiedEntry.replace('</entry>', `  ${localMeta[id].doi}\n  </entry>`);
                }
                return modifiedEntry;
            }
            return arxivEntry;
        });

        fs.writeFileSync(file, mergedData);
        console.log('Successfully merged papers.xml');
    });
}).on('error', (err) => {
    console.error('Error fetching arXiv feed:', err);
    process.exit(1);
});
