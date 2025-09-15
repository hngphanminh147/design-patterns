import { HtmlExportService, PdfExportService } from "./creator";

(async () => {
  const title = "Sample Document";
  const content = "This is a sample document content.";

  const htmlService = new HtmlExportService();
  await htmlService.run(title, content);

  const pdfService = new PdfExportService();
  await pdfService.run(title, content);
})();
