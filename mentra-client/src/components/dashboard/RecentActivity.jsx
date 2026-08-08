import { CheckCircle2 } from "lucide-react"

const activity = [
	"Completed Variables",
	"Finished HTML Module",
	"Generated AI Roadmap",
]

export default function RecentActivity() {
	return (
		<div className='rounded-[30px] border border-white/10 bg-[#18181B] p-8'>
			<h2 className='text-2xl font-bold text-white'>Recent Activity</h2>

			<div className='mt-8 space-y-5'>
				{activity.map((item) => (
					<div key={item} className='flex items-center gap-4'>
						<CheckCircle2 className='text-emerald-400' size={22} />

						<span className='text-slate-300'>{item}</span>
					</div>
				))}
			</div>
		</div>
	)
}
