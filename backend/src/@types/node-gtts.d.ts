declare module 'node-gtts' {
    class NodeGtts {
        constructor(lang?: string);
        save(filepath: string, text: string, callback: (err: Error | null) => void): void;
    }

    function gtts(lang?: string): NodeGtts;
    export = gtts;
}
