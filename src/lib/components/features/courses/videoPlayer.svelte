<script lang="ts">
	import type { Lesson, LessonMaterial } from '$lib/interfaces';
	import { DownloadIcon } from '$lib/icons/outline';

	interface Props {
		lesson: Lesson;
		onProgressUpdate?: (position: number) => void;
		initialPosition?: number;
	}

	let { lesson, onProgressUpdate, initialPosition = 0 }: Props = $props();

	let videoElement: HTMLVideoElement | undefined = $state();
	let isPlaying = $state(false);
	let currentTime = $state(initialPosition);
	let duration = $state(0);

	// Update progress every 5 seconds
	let progressInterval: number | undefined;

	const handlePlay = () => {
		isPlaying = true;
		startProgressTracking();
	};

	const handlePause = () => {
		isPlaying = false;
		stopProgressTracking();
		saveProgress();
	};

	const handleTimeUpdate = () => {
		if (videoElement) {
			currentTime = videoElement.currentTime;
		}
	};

	const handleLoadedMetadata = () => {
		if (videoElement) {
			duration = videoElement.duration;
			if (initialPosition > 0) {
				videoElement.currentTime = initialPosition;
			}
		}
	};

	const startProgressTracking = () => {
		progressInterval = window.setInterval(() => {
			saveProgress();
		}, 5000); // Save every 5 seconds
	};

	const stopProgressTracking = () => {
		if (progressInterval) {
			clearInterval(progressInterval);
		}
	};

	const saveProgress = () => {
		if (videoElement && onProgressUpdate) {
			onProgressUpdate(Math.floor(videoElement.currentTime));
		}
	};

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const handleDownload = (material: LessonMaterial) => {
		window.open(material.resource_url, '_blank');
	};
</script>

<div class="space-y-6">
	<!-- Video Player -->
	<div class="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-lg">
		{#if lesson.video_url}
			<video
				bind:this={videoElement}
				class="h-full w-full"
				controls
				onplay={handlePlay}
				onpause={handlePause}
				ontimeupdate={handleTimeUpdate}
				onloadedmetadata={handleLoadedMetadata}
			>
				<source src={lesson.video_url} type="video/mp4" />
				<track kind="captions" />
				Tu navegador no soporta el elemento de video.
			</video>
		{:else}
			<div class="flex h-full w-full items-center justify-center">
				<p class="text-white">No hay video disponible para esta lección</p>
			</div>
		{/if}
	</div>

	<!-- Lesson Info -->
	<div class="border-grey/30 rounded-lg border bg-white p-6">
		<h2 class="mb-2 text-2xl font-bold text-gray-900">{lesson.title}</h2>
		{#if lesson.summary}
			<p class="mb-4 text-gray-600">{lesson.summary}</p>
		{/if}

		<!-- Progress Info -->
		{#if duration > 0}
			<div class="flex items-center gap-2 text-sm text-gray-500">
				<span>{formatTime(currentTime)}</span>
				<span>/</span>
				<span>{formatTime(duration)}</span>
			</div>
		{/if}
	</div>

	<!-- Materials -->
	{#if lesson.materials.length > 0}
		<div class="border-grey/30 rounded-lg border bg-white p-6">
			<h3 class="mb-4 text-lg font-bold text-gray-900">Materiales de la lección</h3>
			<div class="space-y-2">
				{#each lesson.materials as material (material.resource_url)}
					<div
						class="border-grey/20 hover:bg-cream/30 flex items-center justify-between rounded-lg border p-4 transition-colors"
					>
						<div class="flex-1">
							<p class="font-medium text-gray-900">{material.title}</p>
							{#if material.file_format}
								<p class="text-sm text-gray-500 uppercase">{material.file_format}</p>
							{/if}
						</div>
						{#if material.is_downloadable}
							<button
								onclick={() => handleDownload(material)}
								class="bg-rose hover:bg-rose/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
							>
								<DownloadIcon class="h-4 w-4" />
								Descargar
							</button>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
