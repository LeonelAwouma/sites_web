'use client';

import { useState } from 'react';
import { enhanceWebsiteContent } from '@/ai/flows/enhance-website-content';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Diff, DiffHighlight } from '../ui/diff';

export function ContentEnhancer() {
  const [originalContent, setOriginalContent] = useState('');
  const [enhancedContent, setEnhancedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnhance = async () => {
    if (!originalContent.trim()) {
      setError('Please enter some content to enhance.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEnhancedContent('');
    try {
      const result = await enhanceWebsiteContent({ content: originalContent });
      setEnhancedContent(result.enhancedContent);
    } catch (e) {
      setError('Failed to enhance content. Please try again.');
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="original-content" className="block text-sm font-medium text-gray-700 mb-1">
          Original Content
        </label>
        <Textarea
          id="original-content"
          value={originalContent}
          onChange={(e) => setOriginalContent(e.target.value)}
          placeholder="Paste your website content here..."
          rows={8}
          className="bg-white"
        />
      </div>

      <div className="text-center">
        <Button onClick={handleEnhance} disabled={isLoading}>
          {isLoading ? (
            'Enhancing...'
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" /> Enhance with AI
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
         <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[220px]" />
         </div>
      )}

      {enhancedContent && (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Enhanced Content
            </h3>
            <div className="p-4 border rounded-md bg-secondary/50">
                <Diff unified diff={enhancedContent}>
                    <DiffHighlight>
                    {({children}) => (
                        <span className="bg-green-200 dark:bg-green-900">{children}</span>
                    )}
                    </DiffHighlight>
                </Diff>
            </div>
        </div>
      )}
    </div>
  );
}
