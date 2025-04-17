import { Injectable } from '@nestjs/common';
import * as htmlparser2 from "htmlparser2";

@Injectable()
export class MetadataService {

public async get mediaIconUrl(name: string): Promise<string> {
let id:string = name.replaceAll(" ", "-");
let url: string = "https://media.info/radio/stations/" + id;
let iconurl: string="";
const result = await fetch(url,  {method: "GET"});

if (!result.ok) { return ""; }

const html = await result.text();

const parser = new htmlparser2.Parser({
    onopentag(name, attributes) {
        if (name === "meta" && attributes.property === "og:image") {
iconurl = "https://media.info"+attributes.content;
        }
    }});
parser.write(html);
parser.end();

return iconurl;
}

}
