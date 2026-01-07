
export function normalizeGenres(fields: any): string[] {
    let rawGenres: any[] = [];

    // Collect all potential genre inputs
    if (fields.genres !== undefined && fields.genres !== null) {
        // If it's a single value (string) or array, concat handles it.
        // But if fields.genres is "A", concat makes ["A"].
        // If fields.genres is ["A", "B"], concat makes ["A", "B"].
        rawGenres = rawGenres.concat(fields.genres);
    }
    if (fields['genres[]'] !== undefined && fields['genres[]'] !== null) {
        rawGenres = rawGenres.concat(fields['genres[]']);
    }

    const processedGenres: string[] = [];

    const processItem = (item: any) => {
        if (typeof item === 'string') {
            // Trim whitespace before checking/parsing?
            const trimmed = item.trim();
            if (trimmed.startsWith('[') || trimmed.startsWith('"')) {
                 try {
                    const parsed = JSON.parse(trimmed);
                    if (Array.isArray(parsed)) {
                        parsed.forEach(p => processItem(p));
                    } else if (typeof parsed === 'string' || typeof parsed === 'number') {
                         processedGenres.push(String(parsed));
                    } else {
                         // Fallback for other JSON types (bool, object)
                         processedGenres.push(String(parsed));
                    }
                } catch (e) {
                    // parsing failed, treat as string
                    processedGenres.push(item);
                }
            } else {
                // Regular string, likely not JSON
                 processedGenres.push(item);
            }
        } else if (Array.isArray(item)) {
             item.forEach(i => processItem(i));
        } else if (item !== null && item !== undefined) {
             processedGenres.push(String(item));
        }
    };

    rawGenres.forEach(item => processItem(item));

    // Deduplicate and filter empty
    return Array.from(new Set(processedGenres.map(g => g.trim()).filter(g => g.length > 0)));
}
