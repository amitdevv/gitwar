import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN
});

export async function fetchGitHubProfile(username: string) {
  try {
    const [userResponse, reposResponse, eventsResponse, orgsResponse] = await Promise.all([
      octokit.rest.users.getByUsername({ username }),
      octokit.rest.repos.listForUser({ username, per_page: 100, sort: 'updated' }),
      octokit.rest.activity.listPublicEventsForUser({ username, per_page: 1 }),
      octokit.rest.orgs.listForUser({ username })
    ]);

    const languages = new Map<string, number>();
    
    // Fetch languages for each repository
    await Promise.all(
      reposResponse.data.slice(0, 10).map(async (repo) => {
        const langResponse = await octokit.rest.repos.listLanguages({
          owner: username,
          repo: repo.name,
        });
        
        Object.entries(langResponse.data).forEach(([lang, bytes]) => {
          languages.set(lang, (languages.get(lang) || 0) + bytes);
        });
      })
    );

    // Sort languages by bytes and get top 5
    const topLanguages = Array.from(languages.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang]) => lang);

    // Get last commit date from events
    const lastCommitDate = eventsResponse.data.length > 0 
      ? eventsResponse.data[0].created_at 
      : null;

    // Get organizations
    const organizations = orgsResponse.data.map(org => org.login);

    return {
      username: userResponse.data.login,
      repositories: reposResponse.data.length,
      followers: userResponse.data.followers,
      following: userResponse.data.following,
      topLanguages,
      bio: userResponse.data.bio,
      publicRepos: userResponse.data.public_repos,
      createdAt: userResponse.data.created_at,
      avatarUrl: userResponse.data.avatar_url,
      lastCommitDate,
      // New fields
      location: userResponse.data.location,
      company: userResponse.data.company,
      blog: userResponse.data.blog,
      twitter: userResponse.data.twitter_username,
      organizations,
      status: {
        message: userResponse.data.status?.message,
        emojiHTML: userResponse.data.status?.emoji
      }
    };
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    throw new Error('Failed to fetch GitHub profile');
  }
}