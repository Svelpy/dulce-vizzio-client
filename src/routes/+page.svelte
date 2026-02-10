<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui';
	import Navbar from '$lib/components/ui/navbar.svelte';
	import CategoryNav from '$lib/components/ui/categoryNav.svelte';
	import CourseCard from '$lib/components/features/courses/courseCard.svelte';
	import CategoryCard from '$lib/components/features/courses/categoryCard.svelte';
	import TestimonialCard from '$lib/components/features/courses/testimonialCard.svelte';
	import { CoursesService } from '$lib/services';
	import type { Course } from '$lib/interfaces';
	import { onMount } from 'svelte';
	import { FACEBOOK_URL, INSTAGRAM_URL, TIKTOK_URL, YOUBUBE_URL } from '$lib/constants';
	import { FacebookIcon, InstagramIcon, TikTokIcon } from '$lib/icons/outline';
	import { YoutubeIcon } from '$lib/icons/solid';

	let featuredCourses: Course[] = $state([]);
	let loading = $state(true);

	// Categories data
	const categories = [
		{ title: 'Queques', icon: '🍰', description: 'Queques clásicos y modernos para toda ocasión' },
		{ title: 'Panadería', icon: '🥖', description: 'Panadería artesanal y técnicas profesionales' },
		{ title: 'Postres', icon: '🍮', description: 'Postres tradicionales y gourmet' },
		{
			title: 'Decoración',
			icon: '🎨',
			description: 'Decoración creativa y acabados profesionales'
		},
		{ title: 'Sin horno', icon: '❄️', description: 'Recetas deliciosas sin necesidad de hornear' },
		{
			title: 'Eventos',
			icon: '🎉',
			description: 'Preparaciones especiales para eventos y celebraciones'
		}
	];

	// Testimonials data
	const testimonials = [
		{
			name: 'María González',
			role: 'Estudiante de Macarons',
			comment:
				'Los cursos de Dulce Vizzio transformaron mi pasión en un negocio exitoso. ¡Altamente recomendado!',
			rating: 5,
			avatarUrl: undefined
		},
		{
			name: 'Carlos Ramírez',
			role: 'Chef Pastelero',
			comment:
				'Excelente contenido y profesores muy capacitados. Aprendí técnicas que uso todos los días.',
			rating: 5,
			avatarUrl: undefined
		},
		{
			name: 'Ana Martínez',
			role: 'Emprendedora',
			comment:
				'Gracias a estos cursos pude abrir mi propia pastelería. El mejor inversión que he hecho.',
			rating: 5,
			avatarUrl: undefined
		}
	];

	onMount(async () => {
		try {
			const response = await CoursesService.getAll({ limit: 6, status: 'PUBLISHED' });
			featuredCourses = response.data;
		} catch (error) {
			console.error('Error loading courses:', error);
		} finally {
			loading = false;
		}
	});

	const handleCourseClick = (slug: string) => {
		goto(`/app/courses/${slug}`);
	};

	const handleCategoryClick = (category: string) => {
		goto(`/app/courses?category=${encodeURIComponent(category)}`);
	};
</script>

<div class="min-h-dvh">
	<div class="container mx-auto flex items-center justify-between p-4">
		<div class="flex items-center">
			<img src="/images/logo_dulce_vizzio.png" alt="Logo Dulce Vizzio" class="h-12 w-16" />
		</div>
		<div>
			<Button variant="secondary" onclick={() => goto('/auth/sign-in')}>Iniciar Sesión</Button>
		</div>
	</div>
	<!-- <Navbar /> -->
	<!-- <CategoryNav /> -->

	<!-- Hero Section -->
	<section class="relative overflow-hidden px-4 py-24 pt-16">
		<div class="container mx-auto max-w-7xl">
			<div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
				<!-- Text Content -->
				<div class="text-center lg:text-left">
					<h1 class="mb-6 text-5xl font-bold text-gray-900 lg:text-6xl">
						Domina el Arte de la
						<span class="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent"
							>Repostería</span
						>
					</h1>
					<p class="mb-8 max-w-2xl text-xl text-gray-700">
						Aprende de los mejores chefs pasteleros. Cursos profesionales desde principiante hasta
						experto. Transforma tu pasión en una carrera exitosa.
					</p>
					<div class="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
						<Button size="lg" variant="primary" onclick={() => goto('/app/courses')}>
							Explorar Cursos
						</Button>
						<Button size="lg" variant="outline" onclick={() => goto('/auth/sign-in')}>
							Iniciar Sesión
						</Button>
					</div>

					<!-- Stats -->
					<div class="mt-12 grid grid-cols-2 gap-6 text-center lg:text-left">
						<div>
							<p class="text-3xl font-bold text-light-three dark:text-dark-three">1200+</p>
							<p class="text-sm text-light-two dark:text-dark-two">Estudiantes</p>
						</div>
						<div>
							<p class="text-3xl font-bold text-light-three dark:text-dark-three">100+</p>
							<p class="text-sm text-light-two dark:text-dark-two">Cursos</p>
						</div>
					</div>
				</div>

				<!-- Hero Image -->
				<div class="relative">
					<div class="aspect-square overflow-hidden rounded-3xl shadow-2xl">
						<img
							src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=800&fit=crop"
							alt="Repostería"
							class="h-full w-full object-cover"
						/>
					</div>
					<!-- Floating Badge -->
					<div
						class="dark:ring-dark-five dark:bg-dark-five absolute -bottom-6 -left-6 rounded-2xl bg-light-five p-6 shadow-xl ring-1 ring-light-three"
					>
						<div class="flex items-center gap-4">
							<div class="text-5xl">🎓</div>
							<div>
								<p class="text-3xl font-bold text-light-one dark:text-dark-one">500+</p>
								<p class="text-sm text-light-one dark:text-dark-one">Estudiantes Activos</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Featured Courses -->
	<section class=" px-4 py-20">
		<div class="container mx-auto max-w-7xl">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-4xl font-bold text-light-two dark:text-dark-two">Cursos Destacados</h2>
				<p class="mx-auto max-w-2xl text-lg text-light-two_d dark:text-dark-two_d">
					Explora nuestros cursos más populares y comienza tu viaje en la repostería profesional
				</p>
			</div>

			{#if loading}
				<div class="flex justify-center py-12">
					<div
						class="h-12 w-12 animate-spin rounded-full border-4 border-rose-500 border-t-transparent"
					></div>
				</div>
			{:else if featuredCourses.length > 0}
				<div class="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
					{#each featuredCourses as course (course.id)}
						<CourseCard
							{course}
							onclick={() => handleCourseClick(course.slug)}
							priceVisible={false}
							difficultyVisible={false}
							contentVisible={false}
						/>
					{/each}
				</div>
				<div class="mt-12 text-center">
					<Button
						variant="outline"
						onclick={() => goto('/app/courses')}
						class="border-2 border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white"
					>
						Ver Todos los Cursos
					</Button>
				</div>
			{:else}
				<p class="text-center text-gray-500">No hay cursos disponibles en este momento</p>
			{/if}
		</div>
	</section>

	<!-- Categories -->
	<section class="px-4 py-20">
		<div class="container mx-auto max-w-7xl">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-4xl font-bold text-gray-900">Categorías Populares</h2>
				<p class="mx-auto max-w-2xl text-lg text-gray-600">
					Encuentra el curso perfecto para tus intereses
				</p>
			</div>

			<div class="grid grid-cols-2 gap-6 md:grid-cols-3">
				{#each categories as category}
					<CategoryCard
						title={category.title}
						icon={category.icon}
						description={category.description}
						onclick={() => handleCategoryClick(category.title)}
					/>
				{/each}
			</div>
		</div>
	</section>

	<!-- Testimonials -->
	<section class="px-4 py-20">
		<div class="container mx-auto max-w-7xl">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-4xl font-bold text-gray-900">Lo Que Dicen Nuestros Estudiantes</h2>
				<p class="mx-auto max-w-2xl text-lg text-gray-600">
					Miles de estudiantes han transformado su pasión en éxito
				</p>
			</div>

			<div class="grid grid-cols-2 gap-8 md:grid-cols-3">
				{#each testimonials as testimonial}
					<TestimonialCard {...testimonial} />
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="bg-linear-to-r from-light-three via-light-two to-light-four px-4 py-20">
		<div class="container mx-auto max-w-4xl text-center">
			<h2 class="mb-6 text-4xl font-bold text-white md:text-5xl">¿Listo para Comenzar tu Viaje?</h2>
			<p class="mb-8 text-xl text-white/90">
				Únete a nuestra comunidad de apasionados por la repostería
			</p>
			<Button
				size="xl"
				variant="secondary"
				onclick={() => goto('/auth/sign-in')}
				class="bg-white text-rose-500 hover:bg-gray-100"
			>
				Comenzar Ahora
			</Button>
		</div>
	</section>

	<!-- Footer -->
	<footer class="px-4 py-12 text-light-two dark:text-dark-two">
		<div class="container mx-auto max-w-7xl">
			<div class="grid gap-8 md:grid-cols-4">
				<!-- Brand -->
				<div>
					<h3 class="text-gold mb-4 text-2xl font-bold">Dulce Vizzio</h3>
					<p class="">Tu plataforma de cursos de repostería profesional</p>
				</div>

				<!-- Links -->
				<div>
					<h4 class="mb-4 font-bold">Cursos</h4>
					<ul class="space-y-2">
						<li><a href="/app/courses" class="transition-colors hover:text-white">Explorar</a></li>
						<li>
							<a href="/app/courses?difficulty=BEGINNER" class="transition-colors">Principiante</a>
						</li>
						<li>
							<a href="/app/courses?difficulty=BEGINNER" class="transition-colors">Intermedio</a>
						</li>
						<li>
							<a href="/app/courses?difficulty=ADVANCED" class="transition-colors">Avanzado</a>
						</li>
					</ul>
				</div>

				<div>
					<h4 class="mb-4 font-bold">Soporte</h4>
					<ul class="space-y-2">
						<li>
							<a href="https://wa.me/59175618048" target="_blank" class="transition-colors"
								>Ventas</a
							>
						</li>
						<li>
							<a href="https://wa.me/59175618048" target="_blank" class="transition-colors"
								>Contacto</a
							>
						</li>
						<li>
							<a href="https://wa.me/59160984296" target="_blank" class="transition-colors"
								>Pagina Web</a
							>
						</li>
						<li><a href="#" class="transition-colors">FAQ</a></li>
					</ul>
				</div>

				<div>
					<h4 class="mb-4 font-bold">Redes Sociales</h4>
					<ul class="space-y-2">
						<li class="flex space-x-1">
							<span class="rounded-full bg-blue-500 p-1 text-white"><FacebookIcon /></span><a
								target="_blank"
								href={FACEBOOK_URL}
								class="transition-colors">Facebook</a
							>
						</li>
						<li class="flex space-x-1">
							<span class="rounded-full bg-pink-500 p-1 text-white"><InstagramIcon /></span><a
								target="_blank"
								href={INSTAGRAM_URL}
								class="transition-colors">Instagram</a
							>
						</li>
						<li class="flex space-x-1">
							<span class="rounded-full bg-red-500 p-1 text-white"><YoutubeIcon /></span><a
								target="_blank"
								href={YOUBUBE_URL}
								class="transition-colors">Youtube</a
							>
						</li>
						<li class="flex space-x-1">
							<span class="rounded-full bg-black p-1 text-white"><TikTokIcon /></span><a
								target="_blank"
								href={TIKTOK_URL}
								class="transition-colors">Tiktok</a
							>
						</li>
					</ul>
				</div>
			</div>

			<div class="mt-8 border-t border-light-three pt-8 text-center">
				<p>&copy; 2026 Dulce Vizzio. Todos los derechos reservados.</p>
			</div>
		</div>
	</footer>
</div>
