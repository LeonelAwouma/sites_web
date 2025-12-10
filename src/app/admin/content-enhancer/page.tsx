import { ContentEnhancer } from "@/components/admin/ContentEnhancer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContentEnhancerPage() {
    return (
        <div className="min-h-screen bg-muted flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle>AI-Powered Content Enhancement Tool</CardTitle>
                    <CardDescription>
                        Refine and enhance your website content for improved user engagement using AI.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ContentEnhancer />
                </CardContent>
            </Card>
        </div>
    );
}
