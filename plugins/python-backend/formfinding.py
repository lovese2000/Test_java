from compas.datastructures import Mesh
from compas_tna.diagrams import FormDiagram
from compas_tna.diagrams import ForceDiagram
from compas_tna.utilities import relax_boundary_openings
from compas_tna.equilibrium import horizontal_nodal
from compas_tna.equilibrium import vertical_from_zmax


def from_vertices_and_faces(vs, fs):
    mesh = Mesh.from_vertices_and_faces(vs, fs)
    form = FormDiagram.from_mesh(mesh)
    corners = list(form.vertices_where({'vertex_degree': 2}))

    form.vertices_attribute('is_anchor', True, keys=corners)
    form.edges_attribute('q', 10.0, keys=form.edges_on_boundary())
    relax_boundary_openings(form, corners)

    form.update_boundaries()
    force = ForceDiagram.from_formdiagram(form)

    horizontal_nodal(form, force, alpha=95)
    scale = vertical_from_zmax(form, 450.0)

    return form
