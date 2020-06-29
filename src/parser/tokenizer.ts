export default function tokenize(raw_str: string): string[] {
    const regex = /[\w]+|=|[<>]=?|[\*;(),]|"[\w ]*/g;
    let res = raw_str.match(regex);
    return res; 
}
