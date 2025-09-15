import { Document, HtmlExporter, IExporter, PDFExporter } from "./product";

// Creator
export abstract class AbstractExportService {
  abstract createExporter(): IExporter;

  async run(title: string, content: string): Promise<Document> {
    const document = new Document(title, content);
    const exporter = this.createExporter();
    await exporter.export(document);
    return document;
  }
}

// Concrete Creator
export class HtmlExportService extends AbstractExportService {
  createExporter(): IExporter {
    // Logic to determine which exporter to use
    return new HtmlExporter();
  }
}

export class PdfExportService extends AbstractExportService {
  createExporter(): IExporter {
    // Logic to determine which exporter to use
    return new PDFExporter();
  }
}
