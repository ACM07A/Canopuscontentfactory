import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Globe2,
  HeartPulse,
  Languages,
  Lock,
  MessageSquare,
  Search,
  ShieldCheck,
  Upload,
  UserRound,
} from 'lucide-react';
import { getArticleByPath, resourceArticles, type ResourceArticle } from '../content/resourceArticles';

type LeadState = {
  country: string;
  treatment: string;
  whatsapp: string;
  hasReports: string;
  firstName: string;
  email: string;
  language: string;
  consent: boolean;
};

const initialLead: LeadState = {
  country: '',
  treatment: '',
  whatsapp: '',
  hasReports: 'yes',
  firstName: '',
  email: '',
  language: 'English',
  consent: false,
};

const specialtyMeta = {
  Orthopaedics: { icon: ClipboardCheck, tone: 'text-cyan-700 bg-cyan-50 border-cyan-100' },
  Cardiac: { icon: HeartPulse, tone: 'text-rose-700 bg-rose-50 border-rose-100' },
  Oncology: { icon: ShieldCheck, tone: 'text-indigo-700 bg-indigo-50 border-indigo-100' },
  Transplant: { icon: ShieldCheck, tone: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
  'Spine and Neurosurgery': { icon: ClipboardCheck, tone: 'text-violet-700 bg-violet-50 border-violet-100' },
  Fertility: { icon: HeartPulse, tone: 'text-pink-700 bg-pink-50 border-pink-100' },
  Urology: { icon: FileText, tone: 'text-sky-700 bg-sky-50 border-sky-100' },
  Bariatric: { icon: ClipboardCheck, tone: 'text-amber-700 bg-amber-50 border-amber-100' },
  Ophthalmology: { icon: ShieldCheck, tone: 'text-blue-700 bg-blue-50 border-blue-100' },
  Resource: { icon: FileText, tone: 'text-slate-700 bg-slate-50 border-slate-100' },
  Partner: { icon: Globe2, tone: 'text-teal-700 bg-teal-50 border-teal-100' },
} satisfies Record<ResourceArticle['specialty'], { icon: typeof ClipboardCheck; tone: string }>;

function useResourceMetadata(article?: ResourceArticle, noindex = false) {
  useEffect(() => {
    const title = article ? `${article.title} | Canopus Care` : 'Treatment Guides and Resources | Canopus Care';
    const description = article?.summary || 'Canopus Care treatment resources for international patients planning care in India.';
    document.title = title;
    const meta = document.querySelector('meta[name="description"]') || document.createElement('meta');
    meta.setAttribute('name', 'description');
    meta.setAttribute('content', description);
    if (!meta.parentElement) document.head.appendChild(meta);

    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', window.location.origin + window.location.pathname.replace(/\/$/, ''));
    if (!canonical.parentElement) document.head.appendChild(canonical);

    const schemaId = 'canopus-resource-schema';
    document.getElementById(schemaId)?.remove();
    const robots = document.querySelector('meta[name="robots"]') || document.createElement('meta');
    robots.setAttribute('name', 'robots');
    robots.setAttribute('content', article || noindex ? 'noindex,nofollow' : 'index,follow');
    if (!robots.parentElement) document.head.appendChild(robots);

    const schema = document.createElement('script');
    schema.id = schemaId;
    schema.type = 'application/ld+json';
    schema.text = JSON.stringify(article ? {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description,
      inLanguage: 'en',
      isAccessibleForFree: true,
      publisher: { '@type': 'Organization', name: 'Canopus Care' },
      mainEntityOfPage: window.location.href,
      citation: article.sources.map((source) => source.url),
    } : {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Canopus Care Treatment Guides and Resources',
      publisher: { '@type': 'Organization', name: 'Canopus Care' },
    });
    document.head.appendChild(schema);
  }, [article]);
}

function ArticleCard({ article }: { article: ResourceArticle }) {
  const meta = specialtyMeta[article.specialty];
  const Icon = meta.icon;
  return (
    <a href={article.slug} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0B4A8B]/30 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold ${meta.tone}`}>
          <Icon className="h-4 w-4" />
          {article.specialty}
        </div>
        <span className="text-xs font-semibold text-slate-500">{article.readTime}</span>
      </div>
      <h3 className="mt-5 text-xl font-extrabold tracking-tight text-slate-950">{article.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{article.summary}</p>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-bold text-[#0B4A8B]">
        <span>Read guide</span>
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </a>
  );
}

function LeadRail({ article, ctaSource = 'sticky_rail' }: { article?: ResourceArticle; ctaSource?: string }) {
  const [lead, setLead] = useState<LeadState>({
    ...initialLead,
    treatment: article?.title || '',
  });
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [leadId, setLeadId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const submitStepOne = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    const response = await fetch('/api/resource-leads', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        country: lead.country,
        treatment: lead.treatment,
        whatsapp: lead.whatsapp,
        has_reports: lead.hasReports,
        source_url: window.location.pathname,
        source_page_type: article ? 'treatment_resource' : 'resource_hub',
        speciality: article?.specialty,
        treatment_slug: article?.slug,
        cta_source: ctaSource,
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      setError(data.error?.message || 'Unable to create the lead. Please try again.');
      return;
    }
    setLeadId(data.lead_id);
    setStep(2);
  };

  const submitStepTwo = async (event: FormEvent) => {
    event.preventDefault();
    if (!leadId) return;
    setError('');
    const response = await fetch(`/api/resource-leads/${leadId}/complete`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        first_name: lead.firstName,
        email: lead.email,
        preferred_language: lead.language,
        consent: lead.consent,
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      setError(data.error?.message || 'Unable to complete the intake. Please try again.');
      return;
    }
    setStep(3);
  };

  if (step === 3) {
    return (
      <aside id="lead" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
          <Check className="h-5 w-5" />
        </div>
        <h2 className="mt-4 text-xl font-extrabold text-slate-950">Case review request received</h2>
        <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
          <li>1. We check whether the available records are complete.</li>
          <li>2. A care coordinator contacts you.</li>
          <li>3. With consent, the case can be routed to suitable hospital teams.</li>
          <li>4. Hospitals make clinical decisions and provide plans or estimates.</li>
        </ol>
      </aside>
    );
  }

  return (
    <aside id="lead" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B4A8B]/10 text-[#0B4A8B]">
          <UserRound className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-slate-950">Talk to a care coordinator</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">Canopus Care coordinates records and hospital responses. Doctors and hospitals make clinical decisions.</p>
        </div>
      </div>

      {error && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">{error}</div>}

      {step === 1 ? (
        <form onSubmit={submitStepOne} className="mt-5 space-y-3">
          <label className="block text-xs font-bold text-slate-700">Country
            <input required value={lead.country} onChange={(e) => setLead({ ...lead, country: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0B4A8B]" placeholder="Kenya, Oman, Nigeria..." />
          </label>
          <label className="block text-xs font-bold text-slate-700">Treatment or diagnosis
            <input required value={lead.treatment} onChange={(e) => setLead({ ...lead, treatment: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0B4A8B]" placeholder="Knee replacement, CABG..." />
          </label>
          <label className="block text-xs font-bold text-slate-700">WhatsApp number
            <input required value={lead.whatsapp} onChange={(e) => setLead({ ...lead, whatsapp: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0B4A8B]" placeholder="+254..." />
          </label>
          <label className="block text-xs font-bold text-slate-700">Do you have medical reports?
            <select value={lead.hasReports} onChange={(e) => setLead({ ...lead, hasReports: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0B4A8B]">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B4A8B] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#083867]">
            Get my case reviewed <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <form onSubmit={submitStepTwo} className="mt-5 space-y-3">
          <label className="block text-xs font-bold text-slate-700">First name
            <input required value={lead.firstName} onChange={(e) => setLead({ ...lead, firstName: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0B4A8B]" />
          </label>
          <label className="block text-xs font-bold text-slate-700">Email optional
            <input type="email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0B4A8B]" />
          </label>
          <label className="block text-xs font-bold text-slate-700">Preferred language
            <select value={lead.language} onChange={(e) => setLead({ ...lead, language: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0B4A8B]">
              {['English', 'Arabic', 'French', 'Swahili', 'Bengali', 'Nepali', 'Sinhala', 'Russian', 'Uzbek', 'Indonesian'].map((language) => <option key={language}>{language}</option>)}
            </select>
          </label>
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-800"><Upload className="h-4 w-4" /> Secure report upload</div>
            Upload happens inside the consented Canopus case workspace. Public pages never create public medical-file URLs.
          </div>
          <label className="flex items-start gap-2 text-xs leading-5 text-slate-600">
            <input required type="checkbox" checked={lead.consent} onChange={(e) => setLead({ ...lead, consent: e.target.checked })} className="mt-1 h-4 w-4 rounded border-slate-300" />
            I consent to Canopus Care contacting me and organizing my records for coordinator review. Hospital sharing requires separate consent.
          </label>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B4A8B] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#083867]">
            Complete request <Lock className="h-4 w-4" />
          </button>
        </form>
      )}
    </aside>
  );
}

function ResourceHero() {
  return (
    <section className="bg-[#F8FAFC] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0B4A8B]/15 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#0B4A8B]">
            <BookOpen className="h-4 w-4" /> Canopus Resources
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">Understand your treatment before you travel.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">Clear treatment guides, record checklists, cost evidence and coordinator intake for international patients considering care in India.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-4">
          <div className="flex items-center gap-3 text-sm font-extrabold text-slate-950"><Search className="h-5 w-5 text-[#0B4A8B]" /> Find a guide</div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-slate-600">
            {['Orthopaedics', 'Cardiac', 'Oncology', 'Records', 'Costs', 'Hospitals'].map((item) => (
              <a key={item} href="#guides" className="rounded-xl border border-slate-200 px-3 py-2 transition hover:border-[#0B4A8B]/30 hover:text-[#0B4A8B]">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ResourceHub() {
  useResourceMetadata();
  const groups = useMemo(() => Array.from(new Set(resourceArticles.map((article) => article.specialty))), []);
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <ResourceHero />
      <section id="guides" className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="grid gap-5 md:grid-cols-3">
            {groups.map((group) => {
              const count = resourceArticles.filter((article) => article.specialty === group).length;
              const Icon = specialtyMeta[group].icon;
              const href = group === 'Resource' ? '/resources' : group === 'Partner' ? '/partners' : `/treatments/${group.toLowerCase().replaceAll(' and ', '-').replaceAll(' ', '-')}`;
              return (
                <a key={group} href={href} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-[#0B4A8B]/30 hover:bg-white">
                  <Icon className="h-6 w-6 text-[#0B4A8B]" />
                  <h2 className="mt-4 text-xl font-extrabold">{group}</h2>
                  <p className="mt-2 text-sm text-slate-600">{count} patient-facing guides and checklists ready for acquisition routing.</p>
                </a>
              );
            })}
          </div>
          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight">Popular treatment guides</h2>
                <p className="mt-2 text-sm text-slate-600">{resourceArticles.length} English resources from the current acquisition wave.</p>
              </div>
              <a href="/treatments" className="hidden items-center gap-1 text-sm font-bold text-[#0B4A8B] sm:flex">View treatment directory <ChevronRight className="h-4 w-4" /></a>
            </div>
            <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {resourceArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}
            </div>
          </div>
          <div className="grid gap-6 rounded-3xl border border-slate-200 bg-[#F8FAFC] p-6 md:grid-cols-3">
            {[
              ['Medical record checklist', 'Know what hospitals usually need before they can respond.'],
              ['Hospital quote comparison', 'Compare inclusions, exclusions, validity and assumptions.'],
              ['Return-home handoff', 'Prepare discharge summaries and follow-up questions.'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl bg-white p-5 shadow-sm">
                <FileText className="h-5 w-5 text-[#0B4A8B]" />
                <h3 className="mt-4 font-extrabold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function TreatmentDirectory({ specialty }: { specialty?: ResourceArticle['specialty'] }) {
  const list = specialty ? resourceArticles.filter((article) => article.specialty === specialty) : resourceArticles;
  useResourceMetadata();
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <ResourceHero />
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-extrabold tracking-tight">{specialty ? `${specialty} treatment guides` : 'Treatment directory'}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Start with the flagship treatment guides below. Each guide is built to help patients understand records, estimates, hospital comparison and travel planning before requesting current hospital responses.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list.map((article) => <ArticleCard key={article.slug} article={article} />)}
          </div>
        </div>
      </section>
    </main>
  );
}

function InlineCta({ article, title, body }: { article: ResourceArticle; title: string; body: string }) {
  return (
    <div className="my-9 rounded-2xl border border-[#0B4A8B]/15 bg-[#F5F9FE] p-5">
      <h3 className="text-lg font-extrabold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
      <a href="#lead" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0B4A8B] px-4 py-3 text-sm font-extrabold text-white">Send my reports <ArrowRight className="h-4 w-4" /></a>
    </div>
  );
}

function ArticlePage({ article }: { article: ResourceArticle }) {
  useResourceMetadata(article);
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <nav className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
              <a href="/resources" className="hover:text-[#0B4A8B]">Resources</a><ChevronRight className="h-3 w-3" />
              <a href="/treatments" className="hover:text-[#0B4A8B]">Treatments</a><ChevronRight className="h-3 w-3" />
              <span>{article.specialty}</span>
            </nav>
            <h1 className="mt-5 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">{article.title}</h1>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5">Clinical review pending named reviewer</span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">Research date not recorded</span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">{article.readTime}</span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">{article.sourceCount} source checks</span>
            </div>
            <div className="mt-7 rounded-2xl border border-[#0B4A8B]/15 bg-white p-5 shadow-sm">
              <div className="text-xs font-extrabold uppercase tracking-wide text-[#0B4A8B]">Quick answer</div>
              <p className="mt-2 text-base leading-7 text-slate-700">{article.quickAnswer}</p>
              <a href="#lead" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0B4A8B] px-4 py-3 text-sm font-extrabold text-white">Get my case reviewed <ArrowRight className="h-4 w-4" /></a>
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <LeadRail article={article} />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
          <article className="max-w-[760px] lg:col-span-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-950">Table of contents</h2>
              <div className="mt-4 grid gap-2 text-sm font-bold text-[#0B4A8B] sm:grid-cols-2">
                {['Cost evidence', 'Records checklist', 'Hospitals to evaluate', 'FAQs', 'Sources'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase().replaceAll(' ', '-')}`} className="rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50">{item}</a>
                ))}
              </div>
            </div>

            {article.sections.map((section) => (
              <section key={section.heading} className="mt-10">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">{section.heading}</h2>
                <p className="mt-3 text-base leading-8 text-slate-700">{section.body}</p>
              </section>
            ))}

            <InlineCta article={article} title="Already have some of these reports?" body="Send what you have. We can organize the case and identify what the hospital may still need before a useful response is possible." />

            <section id="records-checklist" className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">Records checklist</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {article.records.map((record) => (
                  <li key={record} className="flex gap-3 rounded-xl bg-white p-3 text-sm font-semibold text-slate-700"><Check className="h-5 w-5 shrink-0 text-emerald-600" /> {record}</li>
                ))}
              </ul>
            </section>

            <section id="cost-evidence" className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">Cost evidence</h2>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                  <tbody>
                    <tr className="border-b border-slate-200"><th className="py-3 pr-4 text-slate-500">Data level</th><td className="py-3 font-bold text-slate-950">{article.costSignal.label}</td></tr>
                    <tr className="border-b border-slate-200"><th className="py-3 pr-4 text-slate-500">Range</th><td className="py-3">{article.costSignal.range}</td></tr>
                    <tr className="border-b border-slate-200"><th className="py-3 pr-4 text-slate-500">Source</th><td className="py-3">{article.costSignal.source}</td></tr>
                    <tr><th className="py-3 pr-4 text-slate-500">Checked</th><td className="py-3">{article.costSignal.checkedAt}</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{article.costSignal.note}</p>
            </section>

            <InlineCta article={article} title="Want a current estimate for your case?" body="Generic internet prices are reference points. Send your records to request current hospital estimates based on your case." />

            <section id="hospitals-to-evaluate" className="mt-10">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">Hospitals to evaluate</h2>
              <p className="mt-3 text-base leading-8 text-slate-700">Compare hospitals by the written response they give for your case: what records were reviewed, what procedure is proposed, what is included, what is excluded and what follow-up will require.</p>
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
                Ask for current hospital evidence before relying on doctor titles, accreditations, package prices or outcome claims. Hospitals and clinicians make medical decisions.
              </div>
            </section>

            <section id="faqs" className="mt-10">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">FAQ</h2>
              <div className="mt-5 space-y-3">
                {article.faqs.map((faq) => (
                  <details key={faq.q} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <summary className="cursor-pointer text-sm font-extrabold text-slate-950">{faq.q}</summary>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{faq.a}</p>
                  </details>
                ))}
              </div>
            </section>

            <section id="sources" className="mt-10 border-t border-slate-200 pt-8">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">Sources</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {article.sources.map((source) => (
                  <li key={source.url}><a href={source.url} className="font-bold text-[#0B4A8B] underline-offset-4 hover:underline">{source.label}</a></li>
                ))}
              </ul>
            </section>
          </article>

          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-28 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-950"><Languages className="h-4 w-4 text-[#0B4A8B]" /> Need help in another language?</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">Tell the coordinator your preferred language. Canopus can organize the case file and hospital communication so your family understands the next steps clearly.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-950"><Globe2 className="h-4 w-4 text-[#0B4A8B]" /> Related resources</div>
                <div className="mt-3 space-y-2">
                  {resourceArticles.filter((item) => item.slug !== article.slug).slice(0, 3).map((item) => (
                    <a key={item.slug} href={item.slug} className="block rounded-xl bg-white p-3 text-sm font-bold text-slate-700 hover:text-[#0B4A8B]">{item.title}</a>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
          <a href="#lead" className="flex items-center justify-center gap-2 rounded-xl bg-[#0B4A8B] px-3 py-3 text-sm font-extrabold text-white"><Upload className="h-4 w-4" /> Send reports</a>
          <a href="#lead" className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-3 py-3 text-sm font-extrabold text-slate-800"><MessageSquare className="h-4 w-4" /> Talk to us</a>
        </div>
      </div>
    </main>
  );
}

function CanonicalResourceFallback({ path }: { path: string }) {
  useResourceMetadata(undefined, true);
  return (
    <main className="min-h-screen bg-white px-4 py-20 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-8">
        <h1 className="text-2xl font-extrabold">This guide is served by the canonical content engine</h1>
        <p className="mt-3 text-sm leading-7 text-slate-700">The browser app does not keep a second patient-facing copy. Reload the canonical route to receive the current reviewed-status, source and indexing controls.</p>
        <a className="mt-5 inline-flex rounded-xl bg-[#0B4A8B] px-4 py-3 text-sm font-extrabold text-white" href={path}>Open canonical guide</a>
      </div>
    </main>
  );
}

export function ResourceEngine({ path }: { path: string }) {
  const article = getArticleByPath(path);
  if (article) return <CanonicalResourceFallback path={path} />;
  if (path.startsWith('/treatments/orthopaedics')) return <TreatmentDirectory specialty="Orthopaedics" />;
  if (path.startsWith('/treatments/cardiac')) return <TreatmentDirectory specialty="Cardiac" />;
  if (path.startsWith('/treatments/oncology')) return <TreatmentDirectory specialty="Oncology" />;
  if (path.startsWith('/treatments/transplant')) return <TreatmentDirectory specialty="Transplant" />;
  if (path.startsWith('/treatments/spine-neurosurgery')) return <TreatmentDirectory specialty="Spine and Neurosurgery" />;
  if (path.startsWith('/treatments/fertility')) return <TreatmentDirectory specialty="Fertility" />;
  if (path.startsWith('/treatments/urology')) return <TreatmentDirectory specialty="Urology" />;
  if (path.startsWith('/treatments/bariatric')) return <TreatmentDirectory specialty="Bariatric" />;
  if (path.startsWith('/treatments/ophthalmology')) return <TreatmentDirectory specialty="Ophthalmology" />;
  if (path.startsWith('/treatments')) return <TreatmentDirectory />;
  return <ResourceHub />;
}

export function HomepageResourcesSection() {
  return (
    <section id="resources" className="border-b border-slate-200 bg-[#F8FAFC] px-4 py-18 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#0B4A8B]/15 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#0B4A8B]">
              <BookOpen className="h-4 w-4" /> Treatment Guides and Resources
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Understand your treatment before you travel</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">Detailed guides on treatment planning, cost evidence, hospital comparisons, medical records and how Canopus coordinates consented hospital responses.</p>
          </div>
          <div className="lg:col-span-5">
            <a href="/resources" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B4A8B] px-5 py-3 text-sm font-extrabold text-white sm:w-auto">Explore all resources <ArrowRight className="h-4 w-4" /></a>
          </div>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {resourceArticles.slice(0, 6).map((article) => <ArticleCard key={article.slug} article={article} />)}
        </div>
      </div>
    </section>
  );
}
