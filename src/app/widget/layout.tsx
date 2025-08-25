export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ margin: 0, padding: 0, background: 'transparent' }}>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --background: transparent !important;
              --foreground: #171717;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: transparent !important;
              border: none !important;
              box-shadow: none !important;
              -webkit-appearance: none !important;
              -moz-appearance: none !important;
              appearance: none !important;
            }
            * {
              box-sizing: border-box !important;
            }
            .bg-transparent {
              background: transparent !important;
            }
          `
        }} />
      </head>
      <body style={{ 
        margin: 0, 
        padding: 0, 
        background: 'transparent', 
        border: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        appearance: 'none'
      }} className="bg-transparent">
        {children}
      </body>
    </html>
  );
}
