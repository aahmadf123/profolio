import { MainLayout } from "@/components/layout/main-layout"
import { ResumeViewer } from "@/components/resume/resume-viewer"

export const metadata = {
  title: "Resume | Portfolio",
  description: "Professional resume and qualifications",
}

export default function ResumePage() {
  return (
    <MainLayout>
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Resume</h1>
            <ResumeViewer />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

