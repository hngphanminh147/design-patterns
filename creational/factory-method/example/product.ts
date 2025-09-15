export class Document {
  constructor(public title: string, public content: string) {}
}

// Product interface
export interface IExporter {
  export(document: Document): Promise<void>;
}

// Concrete Products
export class PDFExporter implements IExporter {
  export(document: Document): Promise<void> {
    return new Promise((resolve) => {
      console.log(
        `[PDF] Exporting document "${document.title}" as PDF. Content: ${document.content}`
      );
      resolve();
    });
  }
  // Logic to export as PDF
}

export class HtmlExporter implements IExporter {
  export(document: Document): Promise<void> {
    return new Promise((resolve) => {
      console.log(
        `<h1>${document.title}</h1>[HTML] Exporting document "${document.title}" as HTML. Content: ${document.content}`
      );
      resolve();
    });
  }
}
