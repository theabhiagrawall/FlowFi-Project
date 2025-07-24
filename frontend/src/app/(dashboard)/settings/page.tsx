import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SettingsForm } from "@/components/settings-form"
import { KycForm } from "@/components/kyc-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Settings</h1>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Update your personal information and profile picture.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="kyc">
          <Card>
            <CardHeader>
              <CardTitle>KYC Verification</CardTitle>
              <CardDescription>
                Verify your identity to unlock all features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KycForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
