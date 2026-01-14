import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Download,
  Copy,
  Check
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getDemoRepos, getDemoRuns } from "@/lib/demo-data";
import { useState } from "react";
import ReactMarkdown from 'react-markdown';

export default function ReportDetail() {
  const { runId } = useParams();
  const [repos] = useState(getDemoRepos());
  const [runs] = useState(getDemoRuns());
  const [copied, setCopied] = useState(false);
  
  const run = runs.find(r => r.id === runId);
  const repo = run ? repos.find(r => r.id === run.repo_id) : null;
  
  const handleCopy = () => {
    if (run?.report_md) {
      navigator.clipboard.writeText(run.report_md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleDownload = () => {
    if (run?.report_md) {
      const blob = new Blob([run.report_md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shipdojo-report-${run.id}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };
  
  if (!run || !run.report_md) {
    return (
      <AppLayout>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Report not found</p>
          <Link to="/reports">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Reports
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/reports">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{repo?.name || 'Unknown Repo'}</h1>
              {run.shipdojo_score && (
                <Badge variant="success" className="text-lg px-3">
                  Score: {run.shipdojo_score}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Report from {new Date(run.finished_at || run.created_at).toLocaleString()}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
        
        {/* Report Content */}
        <Card variant="glass">
          <CardContent className="p-8">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 gradient-text">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold mt-8 mb-4 text-foreground">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-medium mt-6 mb-3 text-foreground">{children}</h3>,
                  p: ({ children }) => <p className="text-muted-foreground mb-4">{children}</p>,
                  ul: ({ children }) => <ul className="list-none space-y-2 mb-4">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-muted-foreground">{children}</ol>,
                  li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
                  strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
                  hr: () => <hr className="border-border my-8" />,
                  em: ({ children }) => <em className="text-muted-foreground/80">{children}</em>,
                }}
              >
                {run.report_md}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
