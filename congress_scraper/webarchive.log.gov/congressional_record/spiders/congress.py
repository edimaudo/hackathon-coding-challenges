# -*- coding: utf-8 -*-
import scrapy
from scrapy.http import HtmlResponse
from dateutil.parser import parse as date_parse
from pyquery import PyQuery as pq
import re

class ScraperSpider(scrapy.Spider):
    name = 'congress'

    def start_requests(self):
        # Expanded range to cover sessions 104 (1995) to 118 (2023-2024)
        for session in range(104, 119):
            yield scrapy.Request(url=f"https://www.congress.gov/congressional-record/{session}/browse-by-date",
                                 callback=self.parse_new_index)

    def parse_new_index(self, response: HtmlResponse):
        for date_cell in response.css(".item_table tr"):
            cells = date_cell.css("td::text").extract()

            if len(cells):
                parsed_date = " ".join(cells[0].split(" ")[:3])
                date = date_parse(parsed_date)
            else:
                continue

            # Consolidating the section parsing to comprehensively cover all provided tabs
            sections = {
                "daily_digest": ("daily-digest", self.parse),
                "senate_section": ("senate-section", self.parse_houses),
                "house_section": ("house-section", self.parse_houses),
                "extension_of_remarks": ("extensions-of-remarks", self.parse_houses)
            }

            for meta_type, (href_keyword, callback) in sections.items():
                section_url = date_cell.css(f"a[href*='{href_keyword}']::attr('href')").extract_first()
                if section_url:
                    yield scrapy.Request(url=response.urljoin(section_url),
                                         callback=callback,
                                         meta={"type": meta_type, "date": date, "title": ""})

    def parse_houses(self, response: HtmlResponse):
        for document in response.css(".item_table tr"):
            url = document.css("a::attr('href')").extract_first()
            title_node = document.css("a").extract_first()
            
            title = pq(title_node).text() if title_node else ""
            
            if url:
                yield scrapy.Request(url=response.urljoin(url), callback=self.parse,
                                     meta={"type": response.meta["type"], "date": response.meta["date"], "title": title})

    def parse(self, response: HtmlResponse):
        # Matches standard Congressional Record speaker prompts at the start of a line
        speaker_pattern = re.compile(r'(?m)^\s*((?:Mr\.|Mrs\.|Ms\.|Miss|The (?:SPEAKER|CHAIRMAN|ACTING PRESIDENT) pro tempore|The PRESIDING OFFICER)[^\.]+)\.')
        
        data = response.css(".txt-box").extract()
        
        for block in data:
            text_content = pq(block).text()
            chunks = speaker_pattern.split(text_content)
            
            date_str = response.meta["date"].strftime("%d%b%Y")
            safe_title = re.sub(r'[^a-zA-Z0-9]', '_', response.meta.get("title", "")).strip('_')
            
            # Extract procedural preamble or debate text occurring before the first formal speaker
            preamble = chunks[0].strip()
            if preamble:
                filename = f"{date_str}_general_debate_{safe_title}.txt"
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(preamble)
            
            # The remaining chunks are returned as [speaker1, speech1, speaker2, speech2, ...]
            # Pair the isolated speakers with their respective speeches
            for i in range(1, len(chunks), 2):
                speaker = chunks[i].strip()
                speech = chunks[i+1].strip()
                
                if not speech:
                    continue
                    
                # Sanitize the extracted speaker string for local file saving
                safe_speaker = re.sub(r'[^a-zA-Z0-9]', '_', speaker.lower())
                safe_speaker = re.sub(r'_+', '_', safe_speaker).strip('_')
                
                filename = f"{date_str}_{safe_speaker}_{safe_title}.txt"
                
                with open(filename, 'w', encoding='utf-8') as f:
                    # Restores the speaker name line for the final text output
                    f.write(f"{speaker}.\n{speech}")