export default function tokenize(raw_str: string): string[] {
    const regex = /[\w]+|=|[<>]=?|[\*;(),]|"[\w ,.<>?(){}\[\]]*"/g;
    const res = raw_str.match(regex);
    return res;
}
